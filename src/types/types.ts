export type PortalCell = [
  "portal",
  {
    to: [number, number]; // [row, col]
    color: string; // tailwind class
  }
];

export type OneWayCell = [
  "oneway",
  {
    direction: "left" | "right" | "up" | "down";
  }
];

export type CellType = "wall" | "exit" | "empty" | "evil" | "eviler" | OneWayCell | PortalCell;