import {
  Bath,
  BedDouble,
  ChefHat,
  Minus,
  Plus,
  Sofa,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomDefinition, RoomId } from "@/lib/calculator/types";

const roomIcons = {
  living: Sofa,
  kitchen: ChefHat,
  bedroom: BedDouble,
  bathroom: Bath,
  dining: UtensilsCrossed,
} satisfies Record<RoomId, LucideIcon>;

type RoomCounterListProps = {
  rooms: RoomDefinition[];
  counts: Record<RoomId, number>;
  maxes: Record<RoomId, number>;
  onChange: (room: RoomId, count: number) => void;
};

export default function RoomCounterList({
  rooms,
  counts,
  maxes,
  onChange,
}: RoomCounterListProps) {
  return (
    <div className="calc-room-list">
      {rooms.map((room) => {
        const Icon = roomIcons[room.id];
        const count = counts[room.id] ?? 0;
        const max = maxes[room.id] ?? 0;

        return (
          <div className="calc-room" key={room.id}>
            <span className="calc-room-icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="calc-room-copy">
              <span className="calc-room-name">{room.name}</span>
              <span className="calc-room-description">{room.description}</span>
            </span>
            <span className="calc-stepper">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="calc-stepper-button"
                onClick={() => onChange(room.id, Math.max(0, count - 1))}
                disabled={count <= 0}
                aria-label={`Remove one ${room.name.toLowerCase()}`}
              >
                <Minus aria-hidden="true" />
              </Button>
              <output className="calc-stepper-value" aria-live="polite">
                {count}
              </output>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="calc-stepper-button"
                onClick={() => onChange(room.id, Math.min(max, count + 1))}
                disabled={count >= max}
                aria-label={`Add one ${room.name.toLowerCase()}`}
              >
                <Plus aria-hidden="true" />
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
