"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  avatarColor?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm", 
  lg: "w-12 h-12 text-base",
};

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  
  if (email) {
    const emailPart = email.split('@')[0];
    return emailPart.slice(0, 2).toUpperCase();
  }
  
  return "??";
}

export function Avatar({ 
  avatarUrl, 
  name, 
  email, 
  size = "md", 
  className,
  avatarColor = "#4ECDC4"
}: AvatarProps) {
  const initials = getInitials(name, email);
  const sizeClasses = sizeMap[size];

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name || email}
        width={48}
        height={48}
        className={cn(
          "rounded-full object-cover",
          sizeClasses,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white",
        sizeClasses,
        className
      )}
      style={{ backgroundColor: avatarColor }}
    >
      {initials}
    </div>
  );
}