const X_Class = "X";
const O_Class = "O";
const playerFlag = "X";
const computerFlag = "O";
// all the winning combinations
const Winning = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("resetButton");

const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
let computerTurn;

startGame();

restartButton.addEventListener("click", startGame);
// start a new game
function startGame() {
  computerTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_Class);
    cell.classList.remove(O_Class);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}
// when a cell is clicked
function handleClick(e) {
  const cell = e.target;
  const currentPlayer = computerTurn ? O_Class : X_Class;
  placeMark(cell, currentPlayer);

  // checks for win, draw, or continue the game
  if (checkWin(currentPlayer)) {
    endGame(currentPlayer);
  } else if (isDraw()) {
    endGame();
  } else {
    switchTurns();
    setBoardHoverClass();
  }
}
// end game if someone or nobody wins
function endGame(player) {
  if (!player) {
    winningMessageTextElement.innerText = "Draw";
  } else {
    winningMessageTextElement.innerText = `${
      computerTurn ? "O's" : "X's"
    } Wins!`;
  }
  // show the winning message and the restart button
  winningMessageElement.classList.add("show");
}
// check when it's draw that all cells are selected and there isn't any winning combination
function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_Class) || cell.classList.contains(O_Class);
  });
}

// add the X or O mark to the selected cell
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

// switch turns
function switchTurns() {
  computerTurn = !computerTurn;
  if (computerTurn) {
    const computerSelection = getComputerSelection();
    const cellElementsArr = Array.from(cellElements);
    // filter the not selected cells and the computer selection, remove the event listener
    cellElementsArr
      .filter((_, index) => {
        console.log(index, computerSelection);
        return !isSelected(index) && index != computerSelection;
      })
      .forEach((element) => element.removeEventListener("click", handleClick));

    // set time out till the computer selection and mark it as selected, then add the event listener to the other not selected cells
    setTimeout(() => {
      cellElements[computerSelection].click();
      cellElementsArr
        .filter((_, index) => !isSelected(index))
        .forEach((element) =>
          element.addEventListener("click", handleClick, { once: true })
        );
    }, 1000);
  }
}

// add the X hover to the cells when it's X's turn
function setBoardHoverClass() {
  board.classList.remove(X_Class);
  board.classList.remove(O_Class);
  if (computerTurn) {
    // board.classList.add(O_Class);
  } else {
    board.classList.add(X_Class);
  }
}

// check if there is any winning combination, and check every index has the same mark
function checkWin(currentClass) {
  return Winning.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

// returns a random number between 0 and 8, and makes sure that it isn't selected
const getComputerSelection = () => {
  // get a random number between 0 and 8
  let rand = Math.floor(Math.random() * 9);

  // make sure that the point has not been selected
  while (isSelected(rand)) {
    rand = Math.floor(Math.random() * 9);
  }

  return rand;
};

// checks if a cell with the provided index is selected in the board, meaning has a class x or class o
const isSelected = (index) => {
  return (
    cellElements[index].classList.contains(X_Class) ||
    cellElements[index].classList.contains(O_Class)
  );
};
