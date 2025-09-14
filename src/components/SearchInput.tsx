import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "bordered";
  showClearButton?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
  size = "md",
  variant = "default",
  showClearButton = true,
  disabled = false,
  onFocus,
  onBlur,
  autoFocus = false,
}) => {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const paddingClasses = {
    sm: "pl-8 pr-8",
    md: "pl-10 pr-10",
    lg: "pl-12 pr-12",
  };

  const iconPositions = {
    sm: "left-2",
    md: "left-3",
    lg: "left-4",
  };

  const clearButtonPositions = {
    sm: "right-2",
    md: "right-3",
    lg: "right-4",
  };

  const variantClasses = {
    default:
      "border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent",
    minimal:
      "border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-300",
    bordered:
      "border-2 border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white",
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-gray-500",
          iconSizes[size],
          iconPositions[size]
        )}
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          sizeClasses[size],
          paddingClasses[size],
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      />
      {showClearButton && value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100",
            clearButtonPositions[size]
          )}
        >
          <X className="h-3 w-3 text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
