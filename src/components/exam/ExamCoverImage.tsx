"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type ExamCoverImageProps = {
  src?: string | null;
  alt: string;
  title?: string;
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
  priority?: boolean;
  showOverlay?: boolean;
};

export function ExamCoverImage({
  src,
  alt,
  title,
  className,
  imgClassName,
  iconClassName = "h-12 w-12",
  priority = false,
  showOverlay = false,
}: ExamCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const imageAlt = title ?? alt;
  const showImage = !!src && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-amber-50",
        className
      )}
    >
      {showImage ? (
        <>
          {/* API-provided URLs may use any host — native img avoids next/image allowlist issues */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={imageAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed(true)}
            className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
          />
          {showOverlay && (
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-white/20"
              aria-hidden
            />
          )}
        </>
      ) : (
        <div className="flex h-full min-h-full w-full items-center justify-center">
          <BookOpen className={cn("text-teal-300", iconClassName)} />
        </div>
      )}
    </div>
  );
}
