import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Calendar, ChevronDown, Search } from "../../icons";
import type { Option } from "../../types";
import { cn } from "../../utils";

interface FieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, helperText, error, children }: FieldProps) {
  return (
    <label className="noir-field">
      {label ? <span className="noir-label">{label}</span> : null}
      {children}
      {error ? <span className="noir-error">{error}</span> : null}
      {!error && helperText ? <span className="noir-helper">{helperText}</span> : null}
    </label>
  );
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function TextInput({ label, helperText, error, className, ...props }: TextInputProps) {
  return (
    <Field error={error} helperText={helperText} label={label}>
      <input className={cn("noir-input", className)} {...props} />
    </Field>
  );
}

export function PhoneInput(props: TextInputProps) {
  return <TextInput autoComplete="tel" inputMode="tel" type="tel" {...props} />;
}

export interface OTPInputProps {
  label?: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function OTPInput({ label, length = 6, value = "", onChange }: OTPInputProps) {
  return (
    <Field label={label}>
      <div className="noir-row">
        {Array.from({ length }).map((_, index) => (
          <input
            aria-label={`OTP digit ${index + 1}`}
            className="noir-input noir-otp-input"
            inputMode="numeric"
            key={index}
            maxLength={1}
            onChange={(event) => {
              const next = value.split("");
              next[index] = event.target.value.slice(-1);
              onChange?.(next.join(""));
            }}
            value={value[index] ?? ""}
          />
        ))}
      </div>
    </Field>
  );
}

export function SearchInput(props: TextInputProps) {
  return <TextInput type="search" {...props} placeholder={props.placeholder ?? "Search"} />;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Textarea({ label, helperText, error, className, ...props }: TextareaProps) {
  return (
    <Field error={error} helperText={helperText} label={label}>
      <textarea className={cn("noir-textarea", className)} {...props} />
    </Field>
  );
}

export interface CountrySelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
}

export function CountrySelector({ label, options, className, ...props }: CountrySelectorProps) {
  return (
    <Field label={label}>
      <select className={cn("noir-select", className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function DatePicker(props: TextInputProps) {
  return <TextInput type="date" {...props} />;
}

export const InputIcon = { Calendar, ChevronDown, Search };
