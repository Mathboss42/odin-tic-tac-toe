const menu = (() => {
    const start = () => game.start();
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
    const markers = ['X', 'O']

    const start = () => {
        console.log('start');
        createPlayers();
        setCurrentPlayer();
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
        // console.log(playerList);
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
    }

    const placeMarker = (e) => {
        const x = e.target.dataset.x;
        const y = e.target.dataset.y;

        // console.log(`clicked tile x = ${x}, y = ${y}`);
        if (!(isMoveLegal(x, y))) {
            return;
        } else {
            gameBoard.update(x, y, currentPlayer.marker);
            setCurrentPlayer();
            // console.log('place marker');
        }
    }

    const isMoveLegal = (x, y) => {
        if (gameBoard.getCurrentCell(x, y).innerHTML === '') {
            return true;
        } else {
            return false;
        }
    }
    
    return {start, restart, quit, placeMarker};
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

    const update = (x, y, marker) => {
        updateGameBoard(x, y, marker);
        updateDisplay(x, y, marker);
        checkForWin();
    }

    const updateGameBoard = (x, y, marker) => {
        gameBoard[x][y] = marker;
        console.log(gameBoard);
    }

    const updateDisplay = (x, y, marker) => {
        console.log('updateDisplay');
        getCurrentCell(x, y).innerHTML = marker;
    }

    const checkForWin = () => {
        console.log('check for win');
        gameBoard.forEach(el => console.log(el.includes('')));
    }

    return {initGameBoard, getCurrentCell, update};
})();



const Player = (name, marker) => {
    let isMyTurn = false;

    return {name, marker, isMyTurn};
}

// gameBoard.initGameBoard();