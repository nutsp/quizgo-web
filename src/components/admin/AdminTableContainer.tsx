import { cn } from "@/lib/utils";

type AdminTableContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminTableContainer({ children, className }: AdminTableContainerProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
