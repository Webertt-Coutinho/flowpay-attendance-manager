type StatCardProps = {
  label: string;
  value: number;
  accent?: boolean;
};

export function StatCard({ label, value, accent }: StatCardProps) {
  const highlighted = accent && value > 0;

  return (
    <div className="group relative flex-1 px-8 py-7 transition-colors hover:bg-white/2.5">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </p>
      <p
        className={`mt-2 font-semibold tabular-nums tracking-tighter ${
          highlighted
            ? 'text-5xl text-amber-300 lg:text-6xl'
            : 'text-5xl text-zinc-50 lg:text-6xl'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
