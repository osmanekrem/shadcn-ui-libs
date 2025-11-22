"use client";

import { useCallback, useMemo } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

const MultiSelect = ({
  placeholder,
  options: values,
  selectedOptions: selectedItems,
  setSelectedOptions: setSelectedItems,
}: ISelectProps) => {
  const handleSelectChange = useCallback((value: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  }, [setSelectedItems]);

  const isOptionSelected = useCallback((value: string) => {
    return selectedItems.includes(value);
  }, [selectedItems]);

  const handleCloseAutoFocus = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const handleItemSelect = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <div>{placeholder}</div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        {values.map((option, index) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            onSelect={handleItemSelect}
            checked={isOptionSelected(option.value)}
            onCheckedChange={() => handleSelectChange(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;

