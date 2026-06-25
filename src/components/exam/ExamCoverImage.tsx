"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type ExamCoverImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
  priority?: boolean;
};

export function ExamCoverImage({
  src,
  alt,
  className,
  imgClassName,
  iconClassName = "h-12 w-12",
  priority = false,
}: ExamCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10",
        className
      )}
    >
      {!showPlaceholder ? (
        // API-provided URLs may use any host — native img avoids next/image allowlist issues
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full min-h-full w-full items-center justify-center">
          <BookOpen className={cn("text-primary/40", iconClassName)} />
        </div>
      )}
    </div>
  );
}
