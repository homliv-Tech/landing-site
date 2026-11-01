import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PACKAGES } from "@/lib/calculator/config";
import type { CalculatorId, PackageId } from "@/lib/calculator/types";
import { cn } from "@/lib/utils";

type PackageCardsProps = {
  calculator: CalculatorId;
  media: Record<PackageId, string>;
  value: PackageId;
  onChange: (value: PackageId) => void;
};

export default function PackageCards({
  calculator,
  media,
  value,
  onChange,
}: PackageCardsProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(String(next) as PackageId)}
      className="calc-package-list"
      aria-label="Choose a package"
    >
      {PACKAGES.map((pkg) => {
        const id = `package-${calculator}-${pkg.id}`;
        const checked = pkg.id === value;

        return (
          <Label
            key={pkg.id}
            htmlFor={id}
            className={cn("calc-package", checked && "is-selected")}
          >
            <RadioGroupItem id={id} value={pkg.id} className="calc-radio" />
            <span className="calc-package-copy">
              <span className="calc-package-heading">
                <span className="calc-package-name">{pkg.name}</span>
                <Badge variant="secondary" className="calc-package-tier">
                  {pkg.tier}
                </Badge>
              </span>
              <span className="calc-package-summary">{pkg.summary}</span>
              <span className="calc-feature-list">
                {pkg.features.map((feature) => (
                  <span className="calc-feature" key={feature}>
                    <Check aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </span>
            </span>
            <span
              className="calc-package-media"
              role="img"
              aria-label={`${pkg.name} package interior inspiration`}
              style={{ backgroundImage: `url("${media[pkg.id]}")` }}
            />
          </Label>
        );
      })}
    </RadioGroup>
  );
}
