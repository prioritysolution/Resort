"use client";

import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import {
  type FieldValues,
  type Control,
  type Path,
  type RegisterOptions,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { disabledFieldClass } from "@/common/formFields/disabledField";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const limitToTwoDecimals = (value: unknown): string => {
  if (value == null) return "";
  const next = String(value).replace(/[^\d.]/g, "");
  const dotIndex = next.indexOf(".");
  if (dotIndex === -1) return next;
  const integerPart = next.slice(0, dotIndex);
  const decimalPart = next
    .slice(dotIndex + 1)
    .replace(/\./g, "")
    .slice(0, 2);
  return `${integerPart}.${decimalPart}`;
};

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled?: boolean;
  hint?: string;
  rules?: RegisterOptions<T, Path<T>>;
  isUpper?: boolean;
  isRequired?: boolean;
  isBlurUpdate?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  formItemClassName?: string;
  autoComplete?: string;
  displayValue?: string;
  digitsOnly?: boolean;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className,
  endContent,
  startContent,
  disabled = false,
  hint,
  rules,
  isUpper = false,
  isRequired = false,
  isBlurUpdate = false,
  readOnly = false,
  maxLength,
  onInput,
  formItemClassName,
  autoComplete,
  displayValue,
  digitsOnly = false,
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({
        field,
        fieldState,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
        fieldState: ControllerFieldState;
      }) => (
        <InputFieldInner
          field={field}
          fieldState={fieldState}
          label={label}
          type={type}
          inputType={inputType}
          placeholder={placeholder}
          className={className}
          endContent={endContent}
          startContent={startContent}
          disabled={disabled}
          hint={hint}
          isUpper={isUpper}
          isRequired={isRequired}
          isBlurUpdate={isBlurUpdate}
          readOnly={readOnly}
          maxLength={maxLength}
          onInput={onInput}
          formItemClassName={formItemClassName}
          autoComplete={autoComplete}
          displayValue={displayValue}
          digitsOnly={digitsOnly}
          isPassword={isPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      )}
    />
  );
};

type InnerProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  label?: string;
  type: string;
  inputType: string;
  placeholder?: string;
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled: boolean;
  hint?: string;
  isUpper: boolean;
  isRequired: boolean;
  isBlurUpdate: boolean;
  readOnly: boolean;
  maxLength?: number;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  formItemClassName?: string;
  autoComplete?: string;
  displayValue?: string;
  digitsOnly: boolean;
  isPassword: boolean;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

function InputFieldInner<T extends FieldValues>({
  field,
  fieldState,
  label,
  type,
  inputType,
  placeholder,
  className,
  startContent,
  endContent,
  disabled,
  hint,
  isUpper,
  isRequired,
  isBlurUpdate,
  readOnly,
  maxLength,
  onInput,
  formItemClassName,
  autoComplete,
  displayValue,
  digitsOnly,
  isPassword,
  showPassword,
  setShowPassword,
}: InnerProps<T>) {
  const [localValue, setLocalValue] = useState(String(field.value ?? ""));
  const hasError = !!fieldState?.error;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || type !== "number") return;

    const stopWheel = (event: WheelEvent) => {
      if (document.activeElement !== input) return;
      event.preventDefault();
      input.blur();
    };

    input.addEventListener("wheel", stopWheel, { passive: false });
    return () => input.removeEventListener("wheel", stopWheel);
  }, [type]);

  useEffect(() => {
    if (isBlurUpdate) {
      setLocalValue(String(field.value ?? ""));
    }
  }, [field.value, isBlurUpdate]);

  return (
    <FormItem className={cn("flex w-full flex-col gap-1.5", formItemClassName)}>
      {label ? (
        <FormLabel className="text-sm font-medium text-foreground">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </FormLabel>
      ) : null}

      <FormControl>
        <div
          className={cn(
            "flex h-10 w-full items-center rounded-md border bg-background",
            "transition-all duration-150",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
            hasError
              ? "border-destructive focus-within:ring-destructive/30"
              : "border-input",
            disabled && disabledFieldClass,
            startContent || endContent || isPassword ? "gap-2" : "",
            className,
          )}
        >
          {startContent ? (
            <div className="shrink-0 pl-3 text-muted-foreground">
              {startContent}
            </div>
          ) : null}

          <Input
            ref={inputRef}
            value={
              displayValue !== undefined
                ? displayValue
                : isBlurUpdate
                  ? localValue
                  : (field.value as string) || ""
            }
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            step={type === "number" ? "0.01" : undefined}
            inputMode={
              digitsOnly ? "numeric" : type === "number" ? "decimal" : undefined
            }
            autoComplete={autoComplete}
            className={cn(
              startContent || endContent || isPassword
                ? "min-w-0 flex-1"
                : "w-full",
              "h-full border-0 bg-transparent p-0 shadow-none outline-none",
              "ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none",
              !startContent && "pl-3",
              !endContent && !isPassword && "pr-3",
              "text-sm text-foreground placeholder:text-muted-foreground",
              disabled && disabledFieldClass,
              type === "number" &&
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              if (digitsOnly) {
                value = value.replace(/\D/g, "");
                e.target.value = value;
              } else if (type === "number") {
                value = limitToTwoDecimals(value);
                e.target.value = value;
              }
              if (isBlurUpdate) {
                setLocalValue(isUpper ? value.toUpperCase() : value);
              } else {
                field.onChange(isUpper ? value.toUpperCase() : value);
              }
            }}
            onBlur={() => {
              if (isBlurUpdate) {
                field.onChange(localValue);
              }
              field.onBlur();
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (
                digitsOnly &&
                e.key.length === 1 &&
                !/\d/.test(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
                return;
              }
              if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onInput={(e: FormEvent<HTMLInputElement>) => {
              if (digitsOnly) {
                const target = e.target as HTMLInputElement;
                const digits = target.value.replace(/\D/g, "");
                if (target.value !== digits) target.value = digits;
              } else if (type === "number") {
                const target = e.target as HTMLInputElement;
                const limited = limitToTwoDecimals(target.value);
                if (target.value !== limited) target.value = limited;
              }
              onInput?.(e);
            }}
          />

          {endContent ? (
            <div className="shrink-0 pr-3 text-muted-foreground">{endContent}</div>
          ) : null}

          {isPassword && !endContent ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 cursor-pointer px-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </div>
      </FormControl>

      {hint && !hasError ? <p className="text-xs text-red-500">{hint}</p> : null}
      <FormMessage className="text-xs text-destructive" />
    </FormItem>
  );
}

export default InputField;
