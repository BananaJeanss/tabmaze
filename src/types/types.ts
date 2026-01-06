export type PortalCell = [
  "portal",
  {
    to: [number, number]; // [row, col]
    color: string; // tailwind class
  }
];

export type CellType = "wall" | "exit" | "empty" | "evil" | PortalCell;
