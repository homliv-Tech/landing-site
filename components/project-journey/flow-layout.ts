/** Keep consecutive steps connected as each row reverses direction. */
export function getFlowPosition(index: number, columns: number) {
  const row = Math.floor(index / columns);
  const positionInRow = index % columns;
  const forward = row % 2 === 0;

  return {
    row: row + 1,
    column: forward ? positionInRow + 1 : columns - positionInRow,
    direction: positionInRow === columns - 1 ? "down" : forward ? "right" : "left",
  };
}
