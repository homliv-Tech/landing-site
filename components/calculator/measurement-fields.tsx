import { Info } from "lucide-react";
import KitchenLayoutDiagram from "@/components/calculator/kitchen-layout-diagram";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getKitchenRunFeet } from "@/lib/calculator/engine";
import type {
  KitchenLayoutDefinition,
  MeasurementKey,
} from "@/lib/calculator/types";

type MeasurementFieldsProps = {
  layout: KitchenLayoutDefinition;
  values: Partial<Record<MeasurementKey, number>>;
  onChange: (key: MeasurementKey, value: number) => void;
};

/** Render only the kitchen runs required by the current layout, with bounded inputs. */
export default function MeasurementFields({
  layout,
  values,
  onChange,
}: MeasurementFieldsProps) {
  const runFeet = getKitchenRunFeet(layout.id, values);

  return (
    <div className="calc-measure">
      <div className="calc-measure-diagram">
        <KitchenLayoutDiagram layout={layout.id} showLabels />
      </div>

      <p className="calc-notice">
        <Info aria-hidden="true" />
        Standard size has been set for your convenience.
      </p>

      <div className="calc-measure-fields">
        {layout.measurements.map((measurement) => {
          const selected = values[measurement.key] ?? measurement.defaultFt;
          const options = Array.from(
            { length: measurement.maxFt - measurement.minFt + 1 },
            (_, index) => measurement.minFt + index,
          );
          const id = `measure-${measurement.key}`;

          return (
            <div className="calc-measure-row" key={measurement.key}>
              <Label className="calc-measure-key" htmlFor={id}>
                {measurement.key}
              </Label>
              <Select
                value={String(selected)}
                onValueChange={(next) =>
                  onChange(measurement.key, Number(next))
                }
              >
                <SelectTrigger
                  id={id}
                  className="calc-measure-trigger"
                  aria-label={`${measurement.label} in feet`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="calc-measure-unit">ft.</span>
              <span className="calc-measure-helper">{measurement.helper}</span>
            </div>
          );
        })}
      </div>

      <p className="calc-hint">
        That is about <strong>{runFeet} running ft</strong> of counter. Adjust
        the measurements if your kitchen differs from the standard size.
      </p>
    </div>
  );
}
