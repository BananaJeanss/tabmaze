// mazes will be tested

import type { CellType } from "../types/types";

export interface MazeTesterProps {
  maze: CellType[][];
}

export default function MazeTester({ maze }: MazeTesterProps): boolean {
  console.groupCollapsed("MazeTester");

  let startRow = -1;
  let startCol = -1;

  outerLoop: for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      const cell = maze[r][c];
      if (
        cell !== "wall" &&
        cell !== "evil"
        // "eviler" is just the spawnpoint for eviler enemies that chase, not always deadly
      ) {
        startRow = r;
        startCol = c;
        break outerLoop;
      }
    }
  }

  console.log(`Starting search at [${startRow}, ${startCol}]`);
  if (startRow === -1) {
    console.error("No valid start point found!");
    console.groupEnd();
    return false;
  }

  const queue: [number, number][] = [];
  const visited = new Set<string>();

  if (startRow !== -1 && startCol !== -1) {
    queue.push([startRow, startCol]);
    visited.add(`${startRow},${startCol}`);
  }

  let steps = 0;

  while (queue.length > 0) {
    const currentPos = queue.shift()!;
    const [row, col] = currentPos;
    steps++;

    // LOG 2: Current location being processed
    console.log(`Step ${steps}: Visiting [${row}, ${col}], Cell type:`, maze[row][col]);

    if (maze[row][col] === "exit") {
      console.log("%c FOUND EXIT!", "color: green; font-weight: bold;");
      console.groupEnd();
      return true;
    }

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];

    for (const [dr, dc] of directions) {
      // Directions helper for logging
      const dirName = dr === -1 ? "UP" : dr === 1 ? "DOWN" : dc === -1 ? "LEFT" : "RIGHT";
      
      let newRow = row + dr;
      let newCol = col + dc;

      // LOG 3: Why a move is rejected
      if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) {
         // console.log(`  x [${dirName}] Out of bounds`);
         continue;
      }
      if (maze[newRow][newCol] === "wall") {
         // console.log(`  x [${dirName}] Hit Wall`);
         continue; 
      }
      if (visited.has(`${newRow},${newCol}`)) {
         // console.log(`  x [${dirName}] Already visited`);
         continue;
      }

      // We repeat the main check here to handle the logging logic properly
      if (
        maze[newRow][newCol] !== "evil" &&
        maze[newRow][newCol] !== "eviler"
      ) {
        // Portal Logic
        if (
          typeof maze[newRow][newCol] === "object" &&
          maze[newRow][newCol] !== null &&
          Array.isArray(maze[newRow][newCol]) &&
          maze[newRow][newCol][0] === "portal"
        ) {
          const portalData = maze[newRow][newCol] as [string, { to: [number, number] }];
          const [toRow, toCol] = portalData[1].to;
          console.log(`  ! [${dirName}] Found Portal at [${newRow},${newCol}] -> warping to [${toRow},${toCol}]`);
          
          visited.add(`${newRow},${newCol}`); // mark portal entrance visited
          newRow = toRow;
          newCol = toCol;
        }

        // One-way Logic
        if (
            typeof maze[newRow][newCol] === "object" &&
            maze[newRow][newCol] !== null &&
            Array.isArray(maze[newRow][newCol]) &&
            maze[newRow][newCol][0] === "oneway"
          ) {
            const onewayData = maze[newRow][newCol] as [string, { direction: "left" | "right" | "up" | "down" }];
            const dir = onewayData[1].direction;
  
            if (
              (dir === "left" && dc !== -1) ||
              (dir === "right" && dc !== 1) ||
              (dir === "up" && dr !== -1) ||
              (dir === "down" && dr !== 1)
            ) {
              console.log(`  x [${dirName}] Blocked by OneWay (${dir}) at [${newRow},${newCol}]`);
              continue; 
            }
          }

        // Final check before adding
        if (!visited.has(`${newRow},${newCol}`)) {
           console.log(`  -> [${dirName}] Adding [${newRow},${newCol}] to queue`);
           visited.add(`${newRow},${newCol}`);
           queue.push([newRow, newCol]);
        }
      }
    }
  }

  console.log("%c FAILED TO FIND EXIT", "color: red; font-weight: bold;");
  console.groupEnd();
  return false;
}
