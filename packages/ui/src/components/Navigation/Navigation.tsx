import type { ReactNode } from "react";
import { ArrowLeft, FileText, Menu, User } from "../../icons";
import { cn } from "../../utils";
import { Avatar } from "../Avatar";
import { Button, IconButton } from "../Button";

export function Header({ title, leading, trailing }: { title: string; leading?: ReactNode; trailing?: ReactNode }) {
  return <header className="noir-header"><div className="noir-row">{leading}<h1 className="noir-title">{title}</h1></div>{trailing}</header>;
}

export function BackButton({ label = "Back", onClick }: { label?: string; onClick?: () => void }) {
  return <Button icon={<ArrowLeft size={16} />} onClick={onClick} variant="ghost">{label}</Button>;
}

export interface BottomNavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onSelect?: (id: string) => void;
}

export function BottomNavigation({ items, inline = false }: { items: BottomNavigationItem[]; inline?: boolean }) {
  return <nav className={inline ? "noir-bottom-nav noir-bottom-nav-inline" : "noir-bottom-nav"}>{items.map((item) => <Button aria-current={item.active ? "page" : undefined} icon={item.icon} key={item.id} onClick={() => item.onSelect?.(item.id)} variant={item.active ? "secondary" : "ghost"}>{item.label}</Button>)}</nav>;
}

export function ProfileMenu({ name, email, avatarUrl, actions }: { name: string; email?: string; avatarUrl?: string; actions?: ReactNode }) {
  return <div className="noir-card noir-stack"><div className="noir-row"><Avatar alt={name} name={name} src={avatarUrl} /><div><h3 className="noir-title">{name}</h3>{email ? <p className="noir-description">{email}</p> : null}</div></div>{actions}</div>;
}

export function MenuButton({ className }: { className?: string }) {
  return <IconButton className={cn(className)} icon={<Menu size={16} />} label="Open menu" variant="ghost" />;
}

export function ProfileButton({ className }: { className?: string }) {
  return <IconButton className={cn(className)} icon={<User size={16} />} label="Open profile" variant="ghost" />;
}

export const NavigationIcon = { FileText, User };
