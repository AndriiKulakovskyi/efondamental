"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch?: (value: string) => void;
  debounce?: number;
  onClear?: () => void;
}

export function SearchInput({
  onSearch,
  debounce = 300,
  onClear,
  className,
  ...props
}: SearchInputProps) {
  const [value, setValue] = React.useState("");
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounce);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounce, onSearch]);

  const handleClear = () => {
    setValue("");
    onClear?.();
    onSearch?.("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("pl-9 pr-9", className)}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

