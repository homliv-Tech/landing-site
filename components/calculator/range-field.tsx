"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type RangeFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
  onChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function RangeField({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  onChange,
}: RangeFieldProps) {
  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const next = clamp(Number.isFinite(parsed) ? parsed : value, min, max);
    onChange(next);
    return next;
  };

  return (
    <div className="calc-range">
      <div className="calc-range-head">
        <Label className="calc-range-label" htmlFor={`${id}-input`}>
          {label}
        </Label>
        <span className="calc-range-value">
          <Input
            key={`${id}-${value}`}
            id={`${id}-input`}
            className="calc-range-input"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            defaultValue={value}
            onBlur={(event) => {
              event.currentTarget.value = String(commit(event.currentTarget.value));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            aria-label={`${label} in ${unit}`}
          />
          <span>{unit}</span>
        </span>
      </div>

      <Slider
        id={id}
        className="calc-range-slider"
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => {
          if (typeof next === "number") onChange(next);
        }}
        aria-label={`${label} in ${unit}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />

      <div className="calc-range-scale">
        <span>{min}</span>
        {hint ? <span id={`${id}-hint`}>{hint}</span> : <span />}
        <span>{max}</span>
      </div>
    </div>
  );
}
