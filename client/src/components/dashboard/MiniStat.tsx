type MiniStatProps = {
  label: string;
  value: string | number;
};

export function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-lg bg-slate-800 p-2 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
