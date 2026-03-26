import clsx from "clsx";
import { CaretDown, X } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { CheckboxBox } from "../../shared/components";

interface FilterOption {
  id: string | number;
  name: string;
  logo?: string | null;
  color?: string;
}

interface ActionsFilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedIds: (string | number)[];
  onSelectionChange: (ids: (string | number)[]) => void;
  className?: string;
}

export const ActionsFilterDropdown = ({
  label,
  options,
  selectedIds,
  onSelectionChange,
  className,
}: ActionsFilterDropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (id: string | number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  return (
    <div ref={dropdownRef} className={clsx("relative", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all",
          "bg-white text-blue-950 border border-gray-200",
          "hover:bg-gray-100",
          selectedIds.length > 0 && "!border-blue-950"
        )}
      >
        <span className="text-sm font-medium">
          {selectedIds.length > 0 ? `${label} (${selectedIds.length})` : label}
        </span>
        <CaretDown
          size={14}
          className={clsx("transition-transform", isOpen && "rotate-180")}
        />
        {selectedIds.length > 0 && (
          <div
            onClick={handleClear}
            className="w-4 h-4 rounded-full bg-gray-400 hover:bg-red-500 flex items-center justify-center transition-colors"
          >
            <X size={10} color="white" />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className={clsx(
            "absolute top-full left-0 mt-2 z-50",
            "bg-cardBackground rounded-xl p-4 shadow-lg",
            "min-w-[300px] max-h-[300px] overflow-y-auto"
          )}
        >
          <div className="grid gap-2">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={clsx(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer",
                    "hover:bg-gray-100 transition-colors"
                  )}
                  onClick={() => handleToggle(option.id)}
                >
                  <CheckboxBox
                    variant="small"
                    className="!border-blue-950 flex-shrink-0"
                    checked={isSelected}
                  />
                  {option.logo && (
                    <img
                      src={option.logo}
                      alt={option.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-sm">{option.name}</span>
                </div>
              );
            })}
            {options.length === 0 && (
              <div className="text-sm text-gray-500 py-2">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
