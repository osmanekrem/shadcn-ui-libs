"use client";

import React, { InputHTMLAttributes, useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { sanitizeSearchInput } from '@/lib/security';

// Simple rate limiter for input changes
const useRateLimit = (limit: number = 10, windowMs: number = 1000) => {
  const requests = useRef<number[]>([]);

  return () => {
    const now = Date.now();
    requests.current = requests.current.filter((time) => now - time < windowMs);

    if (requests.current.length >= limit) {
      return false;
    }

    requests.current.push(now);
    return true;
  };
};

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
  const [isMounted, setIsMounted] = useState(false);
  const checkRateLimit = useRateLimit();
  const previousValueRef = useRef<string | number | undefined>(initialValue);

  useEffect(() => {
    if (type === "number") {
      const numValue = Number(initialValue);
      if (
        isNaN(numValue) ||
        initialValue === null ||
        initialValue === undefined ||
        initialValue === ""
      ) {
        previousValueRef.current = undefined;
      } else {
        previousValueRef.current = numValue;
      }
    }
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    // Rate limiting check
    if (!checkRateLimit()) {
      console.warn("Input rate limit exceeded");
      return;
    }

    const timeout = setTimeout(() => {
      let sanitizedValue:
        | string
        | number
        | undefined
        | (string & readonly string[])
        | (number & readonly string[]) = value;

      // Sanitize based on input type
      if (type === "text" || type === "search") {
        sanitizedValue =
          typeof value === "string"
            ? sanitizeSearchInput(value)
            : String(value);
      } else if (type === "number") {
        const numValue = Number(value);
        if (
          isNaN(numValue) ||
          value === null ||
          value === undefined ||
          value === ""
        ) {
          sanitizedValue = undefined;
        } else {
          sanitizedValue = Math.max(-1000000, Math.min(1000000, numValue));
        }
      }

      // Only call onChange if the value has actually changed
      if (sanitizedValue !== previousValueRef.current) {
        previousValueRef.current = sanitizedValue;
        onChange(sanitizedValue);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange, isMounted, type, checkRateLimit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Basic length validation
    if (inputValue.length > maxLength) {
      return;
    }

    // Additional validation for specific input types
    if (type === "number") {
      // Allow only valid number characters
      if (!/^-?\d*\.?\d*$/.test(inputValue) && inputValue !== "") {
        return;
      }
    }

    setValue(inputValue);
  };

  return (
    <Input
      {...props}
      type={type}
      maxLength={maxLength}
      value={value}
      onChange={handleInputChange}
      // Security attributes
      autoComplete={props.autoComplete || "off"}
      spellCheck={false}
    />
  );
}

export default DebouncedInput;
