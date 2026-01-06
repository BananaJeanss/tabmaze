// mazes will be tested

import type { CellType } from "../types/types";

export interface MazeTesterProps {
  maze: CellType[][];
}

export default function MazeTester({ maze }: MazeTesterProps): boolean {
  const startpoint = maze.findIndex((row) => row.includes("empty")); // first empty tile is start

  const queue: [number, number][] = [];
  const visited = new Set<string>();

  if (startpoint !== -1) {
    // Find the column index of the first 'empty' cell in the start row
    const startCol = maze[startpoint].findIndex((cell) => cell === "empty");
    if (startCol !== -1) {
      queue.push([startpoint, startCol]);
      visited.add(`${startpoint},${startCol}`);
    }
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
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
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
          visited.add(`${newRow},${newCol}`); // mark portal cell as visited
          const [toRow, toCol] = portalData[1].to;
          newRow = toRow;
          newCol = toCol;
        }
        // normal cell visit
        visited.add(`${newRow},${newCol}`);
        queue.push([newRow, newCol]);
      }
    }
  }

  return false;
}
