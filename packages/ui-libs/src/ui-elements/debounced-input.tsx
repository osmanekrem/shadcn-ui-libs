"use client";

import {
  InputHTMLAttributes,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Input } from "../components/ui/input";
// Tree-shakeable import - only imports sanitizeSearchInput
import { sanitizeSearchInput } from "../lib/security/sanitize";
// Tree-shakeable import - only imports useDebounce
import { useDebounce } from "../lib/hooks/use-debounce";
// Tree-shakeable import - only imports useRateLimit
import { useRateLimit } from "../lib/hooks/use-rate-limit";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  type = "text",
  maxLength = 1000,
  ...props
}: {
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);
  const checkRateLimit = useRateLimit();
  const previousValueRef = useRef<string | number | undefined>(initialValue);

  // Memoize onChange callback to prevent unnecessary re-renders
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value changes
  useEffect(() => {
    if (type === "number") {
      const numValue = Number(initialValue);
      previousValueRef.current =
        isNaN(numValue) || initialValue == null || initialValue === ""
          ? undefined
          : numValue;
    } else {
      previousValueRef.current = initialValue;
    }
    setValue(initialValue);
  }, [initialValue, type]);

  // Debounced callback with sanitization and rate limiting
  const handleDebouncedValue = useCallback(
    (debouncedValue: string | number | undefined) => {
      // Rate limiting check
      if (!checkRateLimit()) {
        return;
      }

      let sanitizedValue: string | number | undefined = debouncedValue;

      // Sanitize based on input type
      if (type === "text" || type === "search") {
        sanitizedValue =
          typeof debouncedValue === "string"
            ? sanitizeSearchInput(debouncedValue)
            : String(debouncedValue);
      } else if (type === "number") {
        const numValue = Number(debouncedValue);
        sanitizedValue =
          isNaN(numValue) || debouncedValue == null || debouncedValue === ""
            ? undefined
            : Math.max(-1000000, Math.min(1000000, numValue));
      }

      // Only call onChange if the value has actually changed
      if (sanitizedValue !== previousValueRef.current) {
        previousValueRef.current = sanitizedValue;
        onChangeRef.current(sanitizedValue);
      }
    },
    [type, checkRateLimit]
  );

  // Use debounce hook
  useDebounce(value, debounce, handleDebouncedValue);

  // Memoize handler to prevent unnecessary re-renders
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Basic length validation
      if (inputValue.length > maxLength) {
        return;
      }

      // Additional validation for specific input types
      if (
        type === "number" &&
        inputValue !== "" &&
        !/^-?\d*\.?\d*$/.test(inputValue)
      ) {
        return;
      }

      setValue(inputValue);
    },
    [maxLength, type]
  );

  // Memoize autoComplete value
  const autoCompleteValue = useMemo(
    () => props.autoComplete || "off",
    [props.autoComplete]
  );

  return (
    <Input
      {...props}
      type={type}
      maxLength={maxLength}
      value={value}
      onChange={handleInputChange}
      autoComplete={autoCompleteValue}
      spellCheck={false}
    />
  );
}

export default DebouncedInput;
