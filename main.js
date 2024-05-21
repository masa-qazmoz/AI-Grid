const gridContainer = document.getElementById('gridContainer');
const generateGridBtn = document.getElementById('generateGrid');
const findPathBtn = document.getElementById('findPathBtn');
const pathInfo = document.getElementById('pathInfo');
const heuristicSelect = document.getElementById('heuristic');

let grid = [];
let startX, startY;
let targetPositions = [];
let gridWidth, gridHeight;

function generateGrid() {
  // Use gridWidth and gridHeight instead of width and height
  gridWidth = parseInt(document.getElementById('gridWidth').value, 10);
  gridHeight = parseInt(document.getElementById('gridHeight').value, 10);

  // Clear previous start and target positions
  startX = null;
  startY = null;
  targetPositions = [];

  // Clear the previous grid array
  grid = [];
  
  // Set the style of the grid container to handle rows and columns
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 30px)`;

  gridContainer.innerHTML = ''; // Clear previous grid

  for (let y = 0; y < gridHeight; y++) {
    let row = [];
    for (let x = 0; x < gridWidth; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', handleCellClick);
      gridContainer.appendChild(cell);
      row.push(0); // Initialize as unblocked
    }
    grid.push(row);
  }
}


function handleCellClick(event) {
  const cell = event.target;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  const cellType = document.querySelector('input[name="cellType"]:checked').value;

  if (cellType === 'source') {
    clearSourceAndTarget('source');
    cell.classList.add('source');
    startX = x;
    startY = y;
  } else if (cellType === 'target') {
    if (targetPositions.length < 2) {
      cell.classList.add('target');
      targetPositions.push([x, y]);
    } else {
      alert('You can only have two target cells.');
    }
  } else if (cellType === 'blocked') {
    const isBlocked = cell.classList.toggle('blocked');
    grid[y][x] = isBlocked ? 1 : 0;
  }
}



function clearSourceAndTarget(type) {
  const cells = document.querySelectorAll(`.${type}`);
  cells.forEach((cell) => {
    cell.classList.remove(type);
    if (type === 'target') {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      targetPositions = targetPositions.filter((pos) => pos[0] !== x || pos[1] !== y);
    }
  });
}

function findPath() {
  const heuristicType = heuristicSelect.value;

  if (startX == null || startY == null || targetPositions.length === 0) {
    pathInfo.textContent = 'Please set the start and at least one target cell.';
    return;
  }

  // Clear any previous paths
  clearPath();

  // Convert the grid representation for the A* algorithm
  convertGrid();

  const path = astar(grid, startX, startY, targetPositions, heuristicType);

  if (path.length === 0) {
    pathInfo.textContent = 'No path found.';
  } else {
    pathInfo.textContent = `Path found! Number of steps: ${path.length - 1}`;
    for (const [x, y] of path) {
      // Skip coloring the start and target cells as part of the path
      if (!((x === startX && y === startY) || targetPositions.some(position => position[0] === x && position[1] === y))) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        cell.classList.add('path');
      }
    }

    // Optionally, ensure start and target cells are highlighted again in case they were cleared
    document.querySelector(`.cell[data-x="${startX}"][data-y="${startY}"]`).classList.add('source');
    targetPositions.forEach(([x, y]) => {
      document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`).classList.add('target');
    });
  }
}


function convertGrid() {
  grid = [];
  
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = 0; // Initialize all cells as unblocked
    }
  }

  document.querySelectorAll('.cell.blocked').forEach(cell => {
    const x = parseInt(cell.dataset.x, 10);
    const y = parseInt(cell.dataset.y, 10);
    grid[y][x] = 1; // Set blocked cells
  });
}



function clearPath() {
  document.querySelectorAll('.cell.path').forEach(cell => {
    cell.classList.remove('path');
  });
}




findPathBtn.addEventListener('click', findPath);

// The rest of the code remains the same


generateGridBtn.addEventListener('click', () => {
  generateGrid();
});


findPathBtn.addEventListener('click', findPath);