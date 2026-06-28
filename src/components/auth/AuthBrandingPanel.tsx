import { BrandLogo } from "@/components/brand/BrandLogo";
import { MiniAnswerSheetPreview } from "@/components/MiniAnswerSheetPreview";
import { BRAND } from "@/config/brand";

interface AuthBrandingPanelProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
}

export function AuthBrandingPanel({
  compact = false,
  title,
  subtitle,
}: AuthBrandingPanelProps) {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <BrandLogo variant="text" size="lg" />

      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl">
          {title ?? BRAND.name}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted">
          {subtitle ?? BRAND.tagline}
        </p>
      </div>

      {!compact && (
        <div className="relative max-w-sm">
          <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
          <MiniAnswerSheetPreview />
        </div>
      )}
    </div>
  );
}
