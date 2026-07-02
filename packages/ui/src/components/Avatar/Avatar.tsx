import type { ImgHTMLAttributes } from "react";
import type { NoirSize } from "../../types";
import { cn } from "../../utils";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  size?: NoirSize;
}

export function Avatar({ name, size = "md", src, alt, className, ...props }: AvatarProps) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span aria-label={alt ?? name} className={cn("noir-avatar", `noir-avatar-${size}`, className)}>
      {src ? <img alt={alt ?? name} src={src} {...props} /> : initials}
    </span>
  );
}
