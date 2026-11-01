import { useId, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type ChoiceCardProps = {
  value: string;
  checked: boolean;
  title: string;
  description?: string;
  media?: ReactNode;
  className?: string;
};

export default function ChoiceCard({
  value,
  checked,
  title,
  description,
  media,
  className,
}: ChoiceCardProps) {
  const id = useId();

  return (
    <Label
      htmlFor={id}
      className={cn("calc-choice", checked && "is-selected", className)}
    >
      <RadioGroupItem id={id} value={value} className="calc-radio" />
      {media ? <span className="calc-choice-media">{media}</span> : null}
      <span className="calc-choice-copy">
        <span className="calc-choice-title">{title}</span>
        {description ? (
          <span className="calc-choice-description">{description}</span>
        ) : null}
      </span>
    </Label>
  );
}
