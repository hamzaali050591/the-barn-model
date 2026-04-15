interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  sublabel?: string;
}

export default function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  sublabel,
}: Props) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-xs font-medium text-walnut">
          {label}
          {sublabel && <span className="text-walnut-light ml-1">({sublabel})</span>}
        </label>
        <span className="text-sm font-semibold text-honey tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function DerivedRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 px-3 rounded-md ${
        accent ? 'bg-honey/15' : 'bg-walnut/5'
      }`}
    >
      <span className="text-xs font-medium text-walnut-light">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${accent ? 'text-honey' : 'text-walnut'}`}>
        {value}
      </span>
    </div>
  );
}
