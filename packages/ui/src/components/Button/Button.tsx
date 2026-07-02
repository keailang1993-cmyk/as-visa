import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "../../icons";
import type { NoirSize } from "../../types";
import { cn } from "../../utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: NoirSize;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", loading = false, icon, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button className={cn("noir-button", `noir-button-${variant}`, size !== "md" && `noir-button-${size}`, className)} disabled={disabled || loading} type="button" {...props}>
      {loading ? <LoaderCircle aria-hidden className="noir-spinner" size={16} /> : icon}
      {children}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "children" | "icon"> {
  label: string;
  icon: ReactNode;
}

export function IconButton({ label, icon, className, ...props }: IconButtonProps) {
  return <Button aria-label={label} className={cn("noir-button-icon", className)} icon={icon} {...props} />;
}

export function LoadingButton(props: Omit<ButtonProps, "loading">) {
  return <Button loading {...props} />;
}

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button variant="secondary" {...props} />;
export const GhostButton = (props: ButtonProps) => <Button variant="ghost" {...props} />;
export const TextButton = (props: ButtonProps) => <Button variant="text" {...props} />;
