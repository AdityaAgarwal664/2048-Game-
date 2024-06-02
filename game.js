const size = 4;
let board;
let score = 0;
let bestScore = 0;

window.onload = function() {
    setupGame();
    setupTouchEvents();
}

function setupGame() {
    board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = new Array(size).fill(0);
    }
    addRandomTile();
    addRandomTile();
    updateBoard();
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    let boardBeforeMove = JSON.stringify(board);
    switch (event.key) {
        case 'ArrowLeft':
            slideLeft();
            break;
        case 'ArrowRight':
            slideRight();
            break;
        case 'ArrowUp':
            slideUp();
            break;
        case 'ArrowDown':
            slideDown();
            break;
    }
    if (boardBeforeMove !== JSON.stringify(board)) {
        addRandomTile();
        if (!canMove()) {
            alert('GAME OVER');
        }
    }
    updateBoard();
}

function setupTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;
        let absDeltaX = Math.abs(deltaX);
        let absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                handleKeyPress({ key: 'ArrowRight' });
            } else {
                handleKeyPress({ key: 'ArrowLeft' });
            }
        } else {
            if (deltaY > 0) {
                handleKeyPress({ key: 'ArrowDown' });
            } else {
                handleKeyPress({ key: 'ArrowUp' });
            }
        }
    }
}

function slideLeft() {
    for (let i = 0; i < size; i++) {
        let row = board[i].filter(x => x != 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] == row[j + 1]) {
                row[j] *= 2;
                row[j + 1] = 0;
                score += row[j];
            }
        }
        row = row.filter(x => x != 0);
        while (row.length < size) {
            row.push(0);
        }
        board[i] = row;
    }
}

function slideRight() {
    rotateBoard();
    rotateBoard();
    slideLeft();
    rotateBoard();
    rotateBoard();
}

function slideUp() {
    rotateBoard();
    slideLeft();
    rotateBoard();
    rotateBoard();
    rotateBoard();
}

function slideDown() {
    rotateBoard();
    rotateBoard();
    rotateBoard();
    slideLeft();
    rotateBoard();
}

function rotateBoard() {
    let newBoard = new Array(size);
    for (let i = 0; i < size; i++) {
        newBoard[i] = new Array(size).fill(0);
    }
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            newBoard[j][size - 1 - i] = board[i][j];
        }
    }
    board = newBoard;
}

function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 0) {
                emptyTiles.push({ x: i, y: j });
            }
        }
    }
    if (emptyTiles.length == 0) return;
    let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomTile.x][randomTile.y] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    let boardElement = document.getElementById('game-board');
    let scoreElement = document.getElementById('score');
    let bestScoreElement = document.getElementById('best-score');
    boardElement.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let tileValue = board[i][j];
            let tile = document.createElement('div');
            tile.classList.add('tile');
            if (tileValue > 0) {
                tile.classList.add('tile-' + tileValue);
                tile.innerText = tileValue;
            }
            boardElement.appendChild(tile);
        }
    }
    scoreElement.innerText = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.innerText = bestScore;
    }
}

function canMove() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) return true;
            if (i !== size - 1 && board[i][j] === board[i + 1][j]) return true;
            if (j !== size - 1 && board[i][j] === board[i][j + 1]) return true;
        }
    }
    return false;
}
