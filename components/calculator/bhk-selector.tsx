"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BHK_OPTIONS } from "@/lib/calculator/config";
import { cn } from "@/lib/utils";

type BhkSelection = {
  bhkId: string;
  variantId: string;
};

type BhkSelectorProps = {
  value: BhkSelection;
  onChange: (value: BhkSelection) => void;
};

/** Select a BHK and reveal its home-size variants when multiple sizes are available. */
export default function BhkSelector({ value, onChange }: BhkSelectorProps) {
  return (
    <RadioGroup
      value={value.bhkId}
      onValueChange={(next) => {
        const option = BHK_OPTIONS.find((item) => item.id === String(next));
        if (!option) return;
        onChange({
          bhkId: option.id,
          variantId:
            value.bhkId === option.id && option.variants.length > 1
              ? value.variantId
              : option.variants[0].id,
        });
      }}
      className="calc-bhk-list"
      aria-label="Select your BHK type"
    >
      {BHK_OPTIONS.map((option) => {
        const checked = value.bhkId === option.id;
        const hasVariants = option.variants.length > 1;
        const id = `bhk-${option.id}`;

        return (
          <div
            className={cn("calc-bhk", checked && "is-selected")}
            key={option.id}
          >
            <Label htmlFor={id} className="calc-bhk-row">
              <RadioGroupItem id={id} value={option.id} className="calc-radio" />
              <span className="calc-bhk-name">{option.label}</span>
              {hasVariants ? (
                checked ? (
                  <ChevronUp className="calc-bhk-chevron" aria-hidden="true" />
                ) : (
                  <ChevronDown className="calc-bhk-chevron" aria-hidden="true" />
                )
              ) : null}
            </Label>

            {checked && hasVariants ? (
              <RadioGroup
                value={value.variantId}
                onValueChange={(next) =>
                  onChange({ bhkId: option.id, variantId: String(next) })
                }
                className="calc-bhk-variants"
                aria-label={`${option.label} home size`}
              >
                {option.variants.map((variant) => {
                  const variantChecked = value.variantId === variant.id;
                  return (
                    <Label
                      className={cn(
                        "calc-bhk-variant",
                        variantChecked && "is-selected",
                      )}
                      htmlFor={`${id}-${variant.id}`}
                      key={variant.id}
                    >
                      <RadioGroupItem
                        id={`${id}-${variant.id}`}
                        value={variant.id}
                        className="calc-radio calc-radio--small"
                      />
                      <span className="calc-bhk-variant-copy">
                        <span className="calc-bhk-variant-name">
                          {variant.label}
                        </span>
                        <span className="calc-bhk-variant-note">
                          {variant.note}
                        </span>
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            ) : null}
          </div>
        );
      })}
    </RadioGroup>
  );
}
