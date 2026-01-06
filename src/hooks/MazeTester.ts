// mazes will be tested

import type { CellType } from "../types/types";

export interface MazeTesterProps {
  maze: CellType[][];
}

export default function MazeTester({ maze }: MazeTesterProps): boolean {
  let startRow = -1;
  let startCol = -1;

  outerLoop: for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      const cell = maze[r][c];
      // Check for passable cells (not wall, not evil/eviler)
      // Note: "empty", "exit", "portal", "oneway" are valid starts
      if (
        cell !== "wall" &&
        cell !== "evil" &&
        cell !== "eviler" // Assuming eviler is also lethal/impassable for start
      ) {
        startRow = r;
        startCol = c;
        break outerLoop;
      }
    }
  }

  const queue: [number, number][] = [];
  const visited = new Set<string>();

  if (startRow !== -1 && startCol !== -1) {
    queue.push([startRow, startCol]);
    visited.add(`${startRow},${startCol}`);
  }

  while (queue.length > 0) {
    const currentPos = queue.shift()!;
    const [row, col] = currentPos;
    // if exit, return true
    if (maze[row][col] === "exit") {
      return true;
    }

    // explore all other valid moves
    const directions = [
      [-1, 0], // Up (dr=-1)
      [1, 0], // Down (dr=1)
      [0, -1], // Left (dc=-1)
      [0, 1], // Right (dc=1)
    ];

    for (const [dr, dc] of directions) {
      let newRow = row + dr;
      let newCol = col + dc;
      if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        maze[newRow][newCol] !== "wall" &&
        maze[newRow][newCol] !== "evil" &&
        maze[newRow][newCol] !== "eviler" &&
        !visited.has(`${newRow},${newCol}`)
      ) {
        // Check if cell is a portal
        if (
          typeof maze[newRow][newCol] === "object" &&
          maze[newRow][newCol] !== null &&
          Array.isArray(maze[newRow][newCol]) &&
          maze[newRow][newCol][0] === "portal"
        ) {
          // handle portal teleportation
          const portalData = maze[newRow][newCol] as [
            string,
            { to: [number, number] }
          ];

          visited.add(`${newRow},${newCol}`);

          const [toRow, toCol] = portalData[1].to;
          newRow = toRow;
          newCol = toCol;

          // If the exit of the portal is already visited, we skipped checking it.
          // However, standard BFS handles this by checking visited at the start of next iteration
          // or before pushing. Since we modified newRow/newCol, we should verify validity again.
          if (visited.has(`${newRow},${newCol}`)) continue;

          // Also ensure destination isn't a wall (portals to walls kill the run)
          if (maze[newRow][newCol] === "wall") continue;
        }

        // if oneway, check entering direction
        if (
          typeof maze[newRow][newCol] === "object" &&
          maze[newRow][newCol] !== null &&
          Array.isArray(maze[newRow][newCol]) &&
          maze[newRow][newCol][0] === "oneway"
        ) {
          const onewayData = maze[newRow][newCol] as [
            string,
            { direction: "left" | "right" | "up" | "down" }
          ];
          const dir = onewayData[1].direction;

          // Fix: Ensure the move delta matches the required direction
          // Left requires dc = -1, Right requires dc = 1
          // Up requires dr = -1, Down requires dr = 1
          if (
            (dir === "left" && dc !== -1) ||
            (dir === "right" && dc !== 1) ||
            (dir === "up" && dr !== -1) ||
            (dir === "down" && dr !== 1)
          ) {
            continue; // invalid move, skip
          }
        }

        // normal cell visit (or portal destination)
        visited.add(`${newRow},${newCol}`);
        queue.push([newRow, newCol]);
      }
    }
  }

  return false;
}
