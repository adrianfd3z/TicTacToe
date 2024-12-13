// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setMark, resetBoard };
})();

// Player Factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game Logic Controller
const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameActive = true;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        isGameActive = true;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.updateMessage(`Player ${players[currentPlayerIndex].mark}'s turn`);
    };

    const switchPlayer = () => {
        currentPlayerIndex = 1 - currentPlayerIndex;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],           // Diagonals
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (board.every(cell => cell !== "")) {
            return "tie";
        }

        return null;
    };

    const playRound = (index) => {
        if (!isGameActive) return;

        const currentPlayer = players[currentPlayerIndex];
        const markSet = Gameboard.setMark(index, currentPlayer.mark);

        if (!markSet) return;

        const winner = checkWinner();

        if (winner) {
            isGameActive = false;
            DisplayController.updateMessage(
                winner === "tie" ? "It's a tie!" : `${currentPlayer.name} wins!`
            );
            return;
        }

        switchPlayer();
        DisplayController.updateMessage(`Player ${players[currentPlayerIndex].mark}'s turn`);
    };

    return { startGame, playRound };
})();

// Display Controller
const DisplayController = (() => {
    const boardElement = document.querySelector(".gameboard");
    const messageElement = document.querySelector(".message");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";
        board.forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            cell.dataset.index = index;

            if (mark) {
                cell.classList.add("taken");
            }

            cell.addEventListener("click", handleClick);

            boardElement.appendChild(cell);
        });
    };

    const updateMessage = (message) => {
        messageElement.textContent = message;
    };

    const handleClick = (e) => {
        const index = e.target.dataset.index;
        if (!e.target.classList.contains("taken")) {
            Game.playRound(Number(index));
            renderBoard();
        }
    };

    return { renderBoard, updateMessage };
})();

// Start Game
document.getElementById("restart").addEventListener("click", () => {
    Game.startGame("Player 1", "Player 2");
});

// Initialize
Game.startGame("Player 1", "Player 2");
