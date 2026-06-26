interface LeaderboardHeaderProps {
  title: string;
  subtitle: string;
  meta?: string;
}

export function LeaderboardHeader({ title, subtitle, meta }: LeaderboardHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
      <p className="text-sm text-muted md:text-base">{subtitle}</p>
      {meta && <p className="text-sm font-medium text-primary">{meta}</p>}
    </header>
  );
}
