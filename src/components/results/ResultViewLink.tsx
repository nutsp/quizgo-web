import Link from "next/link";
import { cn } from "@/lib/utils";

type ResultViewLinkProps = {
  href: string;
  className?: string;
};

export function ResultViewLink({ href, className }: ResultViewLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50",
        className
      )}
    >
      ดูผล
    </Link>
  );
}
