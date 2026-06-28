"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

export type BrandLogoProps = {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

const sizeClasses = {
  sm: {
    icon: "h-7 w-7",
    logo: "h-8",
    text: "text-base",
    subtitle: "text-[10px]",
  },
  md: {
    icon: "h-9 w-9",
    logo: "h-10",
    text: "text-lg",
    subtitle: "text-xs",
  },
  lg: {
    icon: "h-11 w-11",
    logo: "h-12",
    text: "text-xl",
    subtitle: "text-sm",
  },
} as const;

function BrandFallbackIcon({
  size,
}: {
  size: NonNullable<BrandLogoProps["size"]>;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-teal-700 font-bold text-white",
        sizeClasses[size].icon,
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base"
      )}
      aria-hidden
    >
      QG
    </div>
  );
}

function BrandWordmark({
  size,
  subtitle,
  className,
}: {
  size: NonNullable<BrandLogoProps["size"]>;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <span className={cn("block truncate font-bold text-slate-950", sizeClasses[size].text)}>
        {BRAND.name}
      </span>
      {subtitle && (
        <span className={cn("block truncate text-slate-500", sizeClasses[size].subtitle)}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

function BrandIconImage({
  src,
  size,
  onError,
}: {
  src: string;
  size: NonNullable<BrandLogoProps["size"]>;
  onError: () => void;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={BRAND.name}
      className={cn("shrink-0 rounded-xl object-contain", sizeClasses[size].icon)}
      onError={onError}
    />
  );
}

function BrandFullLogoImage({
  size,
  onError,
}: {
  size: NonNullable<BrandLogoProps["size"]>;
  onError: () => void;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND.logo}
      alt={BRAND.name}
      className={cn("w-auto shrink-0 object-contain", sizeClasses[size].logo)}
      onError={onError}
    />
  );
}

export function BrandLogo({
  variant = "text",
  size = "md",
  showText = true,
  subtitle,
  href,
  onClick,
  className,
}: BrandLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);

  const content = (() => {
    if (variant === "full" && !logoFailed) {
      return <BrandFullLogoImage size={size} onError={() => setLogoFailed(true)} />;
    }

    const showWordmark = showText && (variant !== "icon" || subtitle);

    if (variant === "icon" && !iconFailed) {
      return <BrandIconImage src={BRAND.icon} size={size} onError={() => setIconFailed(true)} />;
    }

    if (variant === "full" && logoFailed && !iconFailed) {
      return (
        <>
          <BrandIconImage src={BRAND.icon} size={size} onError={() => setIconFailed(true)} />
          {showWordmark && <BrandWordmark size={size} subtitle={subtitle} />}
        </>
      );
    }

    if ((variant === "text" || variant === "icon" || (variant === "full" && logoFailed)) && !iconFailed) {
      return (
        <>
          <BrandIconImage src={BRAND.icon} size={size} onError={() => setIconFailed(true)} />
          {showWordmark && <BrandWordmark size={size} subtitle={subtitle} />}
        </>
      );
    }

    return (
      <>
        <BrandFallbackIcon size={size} />
        {showWordmark && <BrandWordmark size={size} subtitle={subtitle} />}
      </>
    );
  })();

  const inner = (
    <span className={cn("inline-flex items-center gap-2", className)}>{content}</span>
  );

  if (!href) {
    return inner;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} onClick={onClick}>
      {content}
    </Link>
  );
}
