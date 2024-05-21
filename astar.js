class Node {
  constructor(x, y, distFromStart) {
    this.x = x;
    this.y = y;
    this.distFromStart = distFromStart;
    this.heuristicDist = Infinity;
    this.visited = false;
    this.parent = null;
  }

  setHeuristicDist(targetX, targetY, heuristicType) {
    if (heuristicType === 'manhattan') {
      this.heuristicDist = Math.abs(this.x - targetX) + Math.abs(this.y - targetY);
    } else if (heuristicType === 'euclidean') {
      this.heuristicDist = Math.sqrt(Math.pow(this.x - targetX, 2) + Math.pow(this.y - targetY, 2));
    }
  }
}

function astar(grid, startX, startY, targetPositions, heuristicType) {
  let openList = [new Node(startX, startY, 0)];
  let closedList = [];
  let closestTargetIndex = -1;
  let closestTargetDist = Infinity;

  for (let i = 0; i < targetPositions.length; i++) {
    const [targetX, targetY] = targetPositions[i];
    const dist = Math.abs(startX - targetX) + Math.abs(startY - targetY);
    if (dist < closestTargetDist) {
      closestTargetDist = dist;
      closestTargetIndex = i;
    }
  }

  const [targetX, targetY] = targetPositions[closestTargetIndex];
  let startNode = openList[0];
  startNode.setHeuristicDist(targetX, targetY, heuristicType);

  while (openList.length > 0) {
    const currentNode = openList.shift();

    if (currentNode.x === targetX && currentNode.y === targetY) {
      return reconstructPath(currentNode);
    }

    currentNode.visited = true;
    closedList.push(currentNode);

    const neighbors = getNeighbors(grid, currentNode.x, currentNode.y, currentNode.distFromStart);
    for (const neighbor of neighbors) {
      if (neighbor.visited || grid[neighbor.y][neighbor.x] === 1) continue;

      const distFromStart = currentNode.distFromStart + 1;
      let isInOpenList = false;
      for (const node of openList) {
        if (node.x === neighbor.x && node.y === neighbor.y) {
          isInOpenList = true;
          if (distFromStart < node.distFromStart) {
            node.distFromStart = distFromStart;
            node.parent = currentNode;
          }
          break;
        }
      }

      if (!isInOpenList) {
        neighbor.parent = currentNode;
        neighbor.distFromStart = distFromStart;
        neighbor.setHeuristicDist(targetX, targetY, heuristicType);
        openList.push(neighbor);
      }
    }

    openList.sort((a, b) => a.distFromStart + a.heuristicDist - (b.distFromStart + b.heuristicDist));
  }

  return [];
}

function getNeighbors(grid, x, y, distFromStart) {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Define possible moves

  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;

    // Check if the new position is within the grid and not blocked
    if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] === 0) {
      // Create a new node for this valid neighbor
      neighbors.push(new Node(newX, newY, distFromStart + 1));
    }
  }

  return neighbors;
}



function reconstructPath(endNode) {
  const path = [];
  let currentNode = endNode;

  while (currentNode !== null) {
    path.unshift([currentNode.x, currentNode.y]);
    currentNode = currentNode.parent;
  }

  return path;
}