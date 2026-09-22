"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  type FieldValues,
  type Control,
  type Path,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  options: Array<{ [key: string]: unknown; Id: string | number }>;
  optionLabelKey?: string;
  optionValueKey?: string;
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
  onChange?: (value: string | number) => void;
  disableSorting?: boolean;
  isSearch?: boolean;
  defaultValue?: string | number;
  sortValue?: string | number;
  isRequired?: boolean;
  fixedDropdownWidth?: boolean;
  searchPlaceholder?: string;
}

const DropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  options = [],
  optionLabelKey = "Option_Value",
  optionValueKey,
  disabled = false,
  loading = false,
  hint,
  onChange: externalOnChange,
  disableSorting = false,
  defaultValue,
  sortValue,
  isRequired = false,
  fixedDropdownWidth = false,
  searchPlaceholder = "",
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  /** Ignore open-from-click briefly after mount (dialog open click can land on this input). */
  const ignoreClickOpenUntilRef = useRef(0);

  const { field, fieldState } = useController({
    control,
    name,
  });

  const value = field.value;
  const onChange = (val: string | number) => {
    field.onChange(val);
    externalOnChange?.(val);
  };
  const hasError = !!fieldState.error;
  const errorMessage = fieldState.error?.message ?? "";

  const getItemId = (item: Record<string, unknown> | null | undefined): string => {
    if (!item) return "";
    if (optionValueKey && item[optionValueKey] !== undefined) {
      return String(item[optionValueKey] ?? "");
    }
    return String(
      item.Opt_Code ??
        item.Branch_Id ??
        item.Id ??
        item.id ??
        item.value ??
        item.Rank_Id ??
        item[optionLabelKey] ??
        "",
    );
  };

  const getDisplayLabel = (val: unknown) => {
    if (val === null || val === undefined || val === "") return "";
    const found = options.find((opt) => String(getItemId(opt)) === String(val));
    return found ? String(found[optionLabelKey] ?? "") : "";
  };

  const [searchVal, setSearchVal] = useState(() => getDisplayLabel(value));

  useEffect(() => {
    setSearchVal(getDisplayLabel(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  useEffect(() => {
    if (defaultValue && !value && Array.isArray(options)) {
      const defaultItem = options.find(
        (item) => String(getItemId(item)) === defaultValue.toString(),
      );
      if (defaultItem) onChange(defaultValue.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, options, value]);

  const isInteractive = !disabled && !loading;
  const isSearching = searchVal !== "" && searchVal !== getDisplayLabel(value);

  const sortedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    const valid = options.filter((item) => {
      const id = getItemId(item);
      return id !== undefined && id !== null && id !== "";
    });

    if (disableSorting) return valid;

    return [...valid].sort((a, b) => {
      if (
        sortValue &&
        a[sortValue] !== undefined &&
        b[sortValue] !== undefined
      ) {
        if (typeof a[sortValue] === "number" && typeof b[sortValue] === "number") {
          return (a[sortValue] as number) - (b[sortValue] as number);
        }
        return String(a[sortValue]).localeCompare(String(b[sortValue]));
      }

      const aLabel = String(a[optionLabelKey] ?? "").toLowerCase();
      const bLabel = String(b[optionLabelKey] ?? "").toLowerCase();
      return aLabel.localeCompare(bLabel);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, optionLabelKey, disableSorting, sortValue]);

  const filteredOptions = useMemo(() => {
    if (isSearching) {
      const q = searchVal.toLowerCase();
      return sortedOptions.filter((item) =>
        String(item?.[optionLabelKey] ?? "")
          .toLowerCase()
          .includes(q),
      );
    }
    return sortedOptions;
  }, [sortedOptions, isSearching, searchVal, optionLabelKey]);

  useEffect(() => {
    setMounted(true);
    ignoreClickOpenUntilRef.current = Date.now() + 450;
  }, []);

  useEffect(() => {
    if (filteredOptions.length > 0) {
      const selectedIndex = filteredOptions.findIndex(
        (opt) => String(getItemId(opt)) === String(value),
      );
      // Don't highlight first option as if selected when nothing is chosen
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : -1);
    } else {
      setActiveIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filteredOptions, value]);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = rootRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const gap = 4;
      const menuMaxH = 240;
      const spaceBelow = viewportH - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const placeAbove =
        spaceBelow < Math.min(menuMaxH, 160) && spaceAbove > spaceBelow;

      const width = fixedDropdownWidth
        ? Math.min(500, viewportW - 16)
        : rect.width;

      let left = rect.left;
      if (left + width > viewportW - 8) {
        left = Math.max(8, viewportW - width - 8);
      }

      setMenuStyle({
        position: "fixed",
        left,
        width,
        zIndex: 200,
        maxHeight: Math.min(
          menuMaxH,
          placeAbove ? spaceAbove : Math.max(spaceBelow, 120),
        ),
        ...(placeAbove
          ? { bottom: viewportH - rect.top + gap }
          : { top: rect.bottom + gap }),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, fixedDropdownWidth]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setSearchVal(getDisplayLabel(value));
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  const handleSelectOption = (item: Record<string, unknown>) => {
    const itemValue = getItemId(item);
    const itemLabel = String(item?.[optionLabelKey] ?? "");
    setSearchVal(itemLabel);
    setOpen(false);

    if (!itemValue) {
      onChange("");
      return;
    }
    const numValue = Number(itemValue);
    onChange(
      !Number.isNaN(numValue) && String(numValue) === String(itemValue)
        ? numValue
        : String(itemValue),
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isInteractive) return;
    setSearchVal(e.target.value);
    setOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isInteractive) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <FormItem className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <FormLabel
          className={cn(
            "text-sm font-medium text-foreground",
            disabled && "opacity-45",
          )}
        >
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </FormLabel>
      ) : null}
      <FormControl>
        <div ref={rootRef} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            value={searchVal}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (!isInteractive) return;
              if (Date.now() < ignoreClickOpenUntilRef.current) return;
              setOpen(true);
            }}
            disabled={disabled || loading}
            placeholder={
              loading
                ? "Loading..."
                : searchPlaceholder || `Select ${label?.toLowerCase() ?? ""}`
            }
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border bg-background py-2.5 pr-10 pl-3.5 text-[15px] font-normal outline-none transition-all duration-150",
              "focus:border-ring focus:ring-4 focus:ring-ring/18",
              hasError
                ? "border-destructive focus:border-destructive focus:ring-destructive/15"
                : "border-input",
              (disabled || loading) &&
                "cursor-not-allowed bg-muted/80 text-muted-foreground opacity-70",
            )}
          />
          <div className="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-1.5">
            {loading ? <Spinner /> : null}
            <button
              type="button"
              className="cursor-pointer rounded-md p-1 transition-colors hover:bg-muted focus:outline-none disabled:cursor-not-allowed"
              disabled={disabled || loading}
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                if (!isInteractive) return;
                setOpen((prev) => !prev);
                inputRef.current?.focus();
              }}
              aria-label="Toggle options"
            >
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </div>

          {open && isInteractive && mounted
            ? createPortal(
                <div
                  ref={menuRef}
                  style={menuStyle}
                  className="overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    filteredOptions.map((item, index) => {
                      const itemVal = getItemId(item);
                      const isSelected = String(value) === itemVal;
                      const isHighlighted = activeIndex === index;

                      return (
                        <button
                          key={itemVal}
                          type="button"
                          ref={(el) => {
                            if (el && isHighlighted) {
                              el.scrollIntoView({
                                behavior: "auto",
                                block: "nearest",
                              });
                            }
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectOption(item)}
                          className={cn(
                            "relative flex w-full cursor-pointer items-center rounded-lg py-2.5 pr-3.5 pl-8 text-left text-[14px] outline-none select-none",
                            isSelected
                              ? "bg-accent/40 font-medium text-accent-foreground"
                              : "text-foreground",
                            isHighlighted
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50",
                          )}
                        >
                          {isSelected ? (
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              <Check className="h-4 w-4" />
                            </span>
                          ) : null}
                          {String(item?.[optionLabelKey] ?? "")}
                        </button>
                      );
                    })
                  )}
                </div>,
                document.body,
              )
            : null}
        </div>
      </FormControl>
      {hint && !hasError ? (
        <p className="mt-0.5 text-xs text-muted-foreground/70">{hint}</p>
      ) : null}
      {errorMessage ? (
        <FormMessage className="mt-0.5 text-xs text-destructive">
          {errorMessage}
        </FormMessage>
      ) : null}
    </FormItem>
  );
};

export default DropdownField;
