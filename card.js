const tilesContainer = document.querySelector(".tiles");
const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal", "tomato", "mediumorchid", "darkorange", "slateblue", "steelblue", "darkseagreen", "mediumvioletred"];
const colorsPicklist = [...colors, ...colors];
const tileCount = colorsPicklist.length;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let moves = 0;
let startTime = null;
let timerInterval;

function buildTile(color) {
  const element = document.createElement("div");

  element.classList.add("tile");
  element.setAttribute("data-color", color);
  element.setAttribute("data-revealed", "false");

  element.addEventListener("click", () => {
    const revealed = element.getAttribute("data-revealed");

    if (
      awaitingEndOfMove ||
      revealed === "true" ||
      element == activeTile
    ) {
      return;
    }

    // Reveal this color
    element.style.backgroundColor = color;

    if (!activeTile) {
      activeTile = element;
      return;
    }

    const colorToMatch = activeTile.getAttribute("data-color");

    if (colorToMatch === color) {
      element.setAttribute("data-revealed", "true");
      activeTile.setAttribute("data-revealed", "true");

      activeTile = null;
      awaitingEndOfMove = false;
      revealedCount += 2;
      moves++;

      if (revealedCount === tileCount) {
        clearInterval(timerInterval);
        const endTime = new Date();
        const elapsedTime = (endTime - startTime) / 1000; // Time in seconds
        const score = Math.floor(elapsedTime); // Final score based on time taken
        alert(`Congratulations! You won in ${moves} moves and ${elapsedTime} seconds. Your final score is ${score}. Refresh to start again.`);
      }

      return;
    }

    awaitingEndOfMove = true;

    setTimeout(() => {
      activeTile.style.backgroundColor = null;
      element.style.backgroundColor = null;

      awaitingEndOfMove = false;
      activeTile = null;
    }, 1000);
    moves++;
  });

  return element;
}

// Build up tiles
for (let i = 0; i < tileCount; i++) {
  const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
  const color = colorsPicklist[randomIndex];
  const tile = buildTile(color);

  colorsPicklist.splice(randomIndex, 1);
  tilesContainer.appendChild(tile);
}

// Start the timer
startTime = new Date();
timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
  const currentTime = new Date();
  const elapsedTime = (currentTime - startTime) / 1000; // Time in seconds
  const timerElement = document.getElementById('timer');
  timerElement.textContent = `Time: ${Math.floor(elapsedTime)}s`;
}