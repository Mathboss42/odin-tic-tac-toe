const menu = (() => {
    const start = () => {
        game.start();
        startButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
        quitButton.classList.remove('hidden');
    };
    
    const restart = () => game.restart();

    const quit = () => game.quit();

    const startButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');
    const quitButton = document.querySelector('.quit-button');
    
    startButton.addEventListener('click', start);
    restartButton.addEventListener('click', restart);
    quitButton.addEventListener('click', quit);
})();



const game = (() => {
    let playerList = [];
    let currentPlayer;
    let turnCount;
    const markers = ['X', 'O']

    const start = () => {
        console.log('start');
        createPlayers();
        setCurrentPlayer();
        updageTurnCount();
        gameBoard.initGameBoard();
    }
    
    const restart = () => {
        console.log('restart');
        setCurrentPlayer();
    }
    
    const quit = () => {
        console.log('quit');
        
    }
    
    const createPlayers = () => {
        if (playerList.length === 0) {
            for (let i = 0; i < 2; i++) {    
                const newPlayer = Player(`Player ${i+1}`, markers[i]);
                playerList.push(newPlayer);
            }
        }
    }

    const setCurrentPlayer = () => {
        if (currentPlayer === undefined) {
            currentPlayer = playerList[0];
            currentPlayer.isMyTurn = !(currentPlayer.isMyTurn)
        } else {
            if (currentPlayer === playerList[0]) {
                currentPlayer = playerList[1];
                playerList.forEach(el => el.isMyTurn = !(el.isMyTurn));
            } else {
                currentPlayer = playerList[0];
                playerList.forEach(el => el.isMyTurn = !(el.isMyTurn));
            }
        }
        // console.log(currentPlayer);
    }

    const updageTurnCount = () => {
        if (turnCount === undefined) {
            turnCount = 1;
        } else {
            turnCount += 0.5;
        }
        // console.log(`turn count = ${turnCount}`);
    }

    const placeMarker = (e) => {
        const x = e.target.dataset.x;
        const y = e.target.dataset.y;

        if (!(isMoveLegal(x, y))) {
            return;
        } else {
            gameBoard.update(x, y, currentPlayer.marker, turnCount);
            setCurrentPlayer();
            updageTurnCount();
        }
    }

    const isMoveLegal = (x, y) => {
        if (gameBoard.getCurrentCell(x, y).innerHTML === '') {
            return true;
        } else {
            return false;
        }
    }

    const endGame = (result) => {
        console.log('endgame ' + result);
    } 
    
    return {start, restart, quit, placeMarker, endGame};
})();



const gameBoard = (() => {
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    
    const domGrid = document.querySelectorAll('.grid-cell');
    
    const initGameBoard = () => {
        for (let i = 0; i < domGrid.length; i++) {
            domGrid[i].addEventListener('click', game.placeMarker);
        }
    }

    const getCurrentCell = (x, y) => {
        let currentCell;
        for (let i = 0; i < domGrid.length; i++) {
            if ((domGrid[i].dataset.x == x) && (domGrid[i].dataset.y == y)) {
                currentCell = domGrid[i];
            }
        }
        return currentCell;
    }

    const update = (x, y, marker, turnCount) => {
        updateGameBoard(x, y, marker);
        updateDisplay(x, y, marker);
        checkForWin(x, y, marker, turnCount);
    }

    const updateGameBoard = (x, y, marker) => {
        gameBoard[x][y] = marker;
    }

    const updateDisplay = (x, y, marker) => {
        getCurrentCell(x, y).innerHTML = marker;
    }

    const checkForWin = (x, y, marker, turnCount) => {
        if (turnCount >= 3) {
            if (checkLine(marker, x) || checkColumn(marker, y) || checkDiagonals(x, y, marker)) {
                console.log(`WIIIIN!!!`);
            }
        } else if (isGameBoardFull()) {
            console.log('gameboard is full, game over: tie');
        } else {
            return;
        }
    }

    const checkLine = (marker, x) => {
        // console.log(`checkLine called x=${x} and marker is ${marker}`);
        let bool;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[x][i] == marker) {
                bool = true;
                continue;
            } else {
                bool = false;
                break;
            }
        }
        // console.log(`bool = ${bool}`);
        return bool;
    }

    const checkColumn = (marker, y) => {
        // console.log(`checkColumn called y=${y} and marker is ${marker}`);
        let bool;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i][y] == marker) {
                bool = true;
                continue;
            } else {
                bool = false;
                break;
            }
        }
        // console.log(`bool = ${bool}`);
        return bool;
    }

    const checkDiagonals = (x, y, marker) => {
        let bool;
        if (!((x === y) || (x == 0 && y == 2) || (x == 2 && y == 0))) {
            return;
        } else if (x === y) {
            for (let i = 0; i < gameBoard.length; i++) {
                if(gameBoard[i][i] == marker) {
                    bool = true;
                    continue;
                } else {
                    bool = false;
                    break;
                }
            }
        } else {
            let j = 2;
            for (let i = 0; i < gameBoard.length; i++) {
                if(gameBoard[i][j] == marker) {
                    bool = true;
                    j--;
                    continue;
                } else {
                    bool = false;
                    break;
                }
            }
        }
        return bool;
    } 

    const isGameBoardFull = () => {
        let isFull = true;
        gameBoard.forEach(el => {
            if (el.includes('')) {
                isFull = false;
            }
        });
        return isFull;
    }

    return {initGameBoard, getCurrentCell, update};
})();



const Player = (name, marker) => {
    let isMyTurn = false;

    return {name, marker, isMyTurn};
}