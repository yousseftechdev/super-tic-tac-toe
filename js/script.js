document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');

    let currentPlayer = 'X';
    let gameState = Array(9).fill().map(() => Array(9).fill(''));
    let bigBoardState = Array(9).fill('');
    let activeBigCell = -1;

    function createBoard() {
        for (let i = 0; i < 9; i++) {
            const bigCell = document.createElement('div');
            bigCell.classList.add('big-cell');
            for (let j = 0; j < 9; j++) {
                const smallCell = document.createElement('button');
                smallCell.classList.add('small-cell');
                smallCell.dataset.bigIndex = i;
                smallCell.dataset.smallIndex = j;
                smallCell.addEventListener('click', handleCellClick);
                bigCell.appendChild(smallCell);
            }
            gameBoard.appendChild(bigCell);
        }
    }

    function handleCellClick(event) {
        const bigIndex = parseInt(event.target.dataset.bigIndex);
        const smallIndex = parseInt(event.target.dataset.smallIndex);

        if (gameState[bigIndex][smallIndex] || bigBoardState[bigIndex] || 
            (activeBigCell !== -1 && activeBigCell !== bigIndex)) {
            return;
        }

        gameState[bigIndex][smallIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.disabled = true;

        if (checkWin(gameState[bigIndex])) {
            bigBoardState[bigIndex] = currentPlayer;
            gameBoard.children[bigIndex].classList.add(`won-${currentPlayer.toLowerCase()}`);
            if (checkWin(bigBoardState)) {
                status.textContent = `Player ${currentPlayer} wins the game!`;
                disableAllCells();
                return;
            }
        } else if (gameState[bigIndex].every(cell => cell !== '')) {
            bigBoardState[bigIndex] = 'T';
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;

        activeBigCell = bigBoardState[smallIndex] ? -1 : smallIndex;
        updateActiveCells();
    }

    function checkWin(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => 
            board[pattern[0]] !== '' && 
            board[pattern[0]] === board[pattern[1]] && 
            board[pattern[0]] === board[pattern[2]]
        );
    }

    function updateActiveCells() {
        const bigCells = gameBoard.children;
        for (let i = 0; i < 9; i++) {
            if (activeBigCell === -1 || activeBigCell === i) {
                bigCells[i].classList.add('active');
                for (let j = 0; j < 9; j++) {
                    bigCells[i].children[j].disabled = gameState[i][j] !== '' || bigBoardState[i] !== '';
                }
            } else {
                bigCells[i].classList.remove('active');
                for (let j = 0; j < 9; j++) {
                    bigCells[i].children[j].disabled = true;
                }
            }
        }
    }

    function disableAllCells() {
        const cells = document.querySelectorAll('.small-cell');
        cells.forEach(cell => cell.disabled = true);
    }

    function resetGame() {
        gameState = Array(9).fill().map(() => Array(9).fill(''));
        bigBoardState = Array(9).fill('');
        currentPlayer = 'X';
        activeBigCell = -1;
        status.textContent = `Player ${currentPlayer}'s turn`;

        const cells = document.querySelectorAll('.small-cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });

        const bigCells = document.querySelectorAll('.big-cell');
        bigCells.forEach(cell => {
            cell.classList.remove('won-x', 'won-o', 'active');
        });

        updateActiveCells();
    }

    createBoard();
    updateActiveCells();
    resetBtn.addEventListener('click', resetGame);
});
