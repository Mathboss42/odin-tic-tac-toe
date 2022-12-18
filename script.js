const menu = (() => {
    const start = () => {
        startButton.classList.add('hidden');
        container.classList.add('blurred');
        gamemodeInterface.classList.remove('hidden');
    };

    const startGame = (e) => {
        game.start(e.target.dataset.gamemode)
        restartButton.classList.remove('hidden');
        quitButton.classList.remove('hidden');
        container.classList.remove('blurred');
        gamemodeInterface.classList.add('hidden');
    }
    
    const restart = () => {
        game.restart();
        clearAnnouncement();
    }

    const quit = () => {
        game.quit();
        clearAnnouncement();
        startButton.classList.remove('hidden');
        restartButton.classList.add('hidden');
        quitButton.classList.add('hidden');
    }

    const displayAnnouncement = (message) => {
        announcement.innerHTML = message;
        announcement.classList.remove('hidden');
    }

    const clearAnnouncement = () => {
        announcement.innerHTML = '';
        announcement.classList.add('hidden');
    }

    const startButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');
    const quitButton = document.querySelector('.quit-button');
    const announcement = document.querySelector('.announcement');
    const gamemodeInterface = document.querySelector('.gamemode-interface');
    const container = document.querySelector('.container');
    const playerVsPlayerButton = document.querySelector('[data-gamemode="player-vs-player"]');
    const playerVsAiButton = document.querySelector('[data-gamemode="player-vs-ai"]');
    
    startButton.addEventListener('click', start);
    restartButton.addEventListener('click', restart);
    quitButton.addEventListener('click', quit);
    playerVsPlayerButton.addEventListener('click', startGame);
    playerVsAiButton.addEventListener('click', startGame);

    return {displayAnnouncement}
})();



const game = (() => {
    let playerList = [];
    let currentPlayer;
    let turnCount;
    let currentGamemode = '';
    const markers = ['X', 'O']

    const start = (gamemode) => {
        console.log('start');
        currentGamemode = gamemode;
        createPlayers(gamemode);
        setCurrentPlayer();
        updageTurnCount();
        gameBoard.initGameBoard('start');
    }
    
    const restart = () => {
        console.log('restart ' + currentGamemode);
        playerList = [];
        createPlayers(currentGamemode);
        setCurrentPlayer();
        turnCount = undefined;
        updageTurnCount();
        gameBoard.initGameBoard('restart');
    }
    
    const quit = () => {
        console.log('quit');
        playerList = [];
        turnCount = undefined;
        currentPlayer = undefined;
        gameBoard.initGameBoard('quit');
    }

    const createPlayers = (gamemode) => {
        switch (gamemode) {
            case 'player-vs-player':
                console.log(gamemode);
                if (playerList.length === 0) {
                    for (let i = 0; i < 2; i++) {    
                        const newPlayer = Player(`Player ${i+1}`, markers[i]);
                        playerList.push(newPlayer);
                    }
                }           
                console.log(playerList);
                break;
            case 'player-vs-ai':
                if (playerList.length === 0) {
                    const newPlayer = Player(`Player`, markers[0]);
                    playerList.push(newPlayer);
                    
                    const newAi = Ai(`AI`, markers[1]);
                    playerList.push(newAi);
                }      
                console.log(gamemode);
                console.log(playerList);
                break;
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
                if (currentGamemode === 'player-vs-ai') {
                    setTimeout(playerList[1].play, 1000);
                }
            } else {
                currentPlayer = playerList[0];
                playerList.forEach(el => el.isMyTurn = !(el.isMyTurn));
            }
        }
    }

    const updageTurnCount = () => {
        if (turnCount === undefined) {
            turnCount = 1;
        } else {
            turnCount += 0.5;
        }
    }

    const placeMarker = (x, y) => {
        if (!(isMoveLegal(x, y))) {
            return;
        } else {
            gameBoard.update(x, y, currentPlayer.marker, turnCount);
            if (gameBoard.getStatus() === 'ongoing') {
                setCurrentPlayer();
                updageTurnCount();
            } else {
                endGame(gameBoard.getStatus(), currentPlayer);
            }
        }
    }

    const isMoveLegal = (x, y) => {
        if (gameBoard.getCurrentCell(x, y).innerHTML === '') {
            return true;
        } else {
            return false;
        }
    }

    const endGame = (status, currentPlayer) => {
        switch (status) {
            case 'win':
                menu.displayAnnouncement(`${currentPlayer.name} won! Congratulations!`);
                break;
            case 'draw':
                menu.displayAnnouncement(`Draw! No winner this time!`);
        }
    } 

    const getPlayerList = () => {
        return playerList;
    }
    
    return {start, restart, quit, placeMarker, getPlayerList};
})();



const gameBoard = (() => {
    let status;
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    
    const domGrid = document.querySelectorAll('.grid-cell');
    
    const initGameBoard = (value) => {
        switch (value) {
            case 'start':
                status = 'ongoing';
                enableBoard();
                break;
            case 'restart':
                status = 'ongoing';
                enableBoard();
                gameBoard = [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ];
                clearDisplay();
                break;
            case 'quit':
                status = undefined;
                disableBoard();
                gameBoard = [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ];
                clearDisplay();
                break;
        }
        
    }

    const enableBoard = () => {
        for (let i = 0; i < domGrid.length; i++) {
            domGrid[i].addEventListener('click', placeMarker);
        }
    }

    const disableBoard = () => {
        for (let i = 0; i < domGrid.length; i++) {
            domGrid[i].removeEventListener('click', placeMarker);
        }
    }

    const placeMarker = (e) => {
        const coords = getCurrentCellCoordinates(e);
        game.placeMarker(coords[0], coords[1]);
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

    getCurrentCellCoordinates = (e) => {
        return [e.target.dataset.x, e.target.dataset.y];
    }

    const update = (x, y, marker, turnCount) => {
        updateGameBoard(x, y, marker);
        updateDisplay(x, y, marker);
        if (isTerminal(x, y, marker, turnCount)) {
            disableBoard();
        }
    }

    const isTerminal = (x, y, marker, turnCount) => {
        if (checkForWin(x, y, marker, turnCount)) {
            status = 'win';
            return 'win';
        } else if (isGameBoardFull()) {
            status = 'draw';
            return 'draw';
        } else {
            return false;
        }
    }

    const updateGameBoard = (x, y, marker) => {
        gameBoard[x][y] = marker;
    }

    const updateDisplay = (x, y, marker) => {
        getCurrentCell(x, y).innerHTML = marker;
    }

    const clearDisplay = () => {
        domGrid.forEach(el => el.innerHTML = '');
    }

    const checkForWin = (x, y, marker, turnCount) => {
        if (turnCount >= 3) {
            if (checkLine(marker, x) 
            || checkColumn(marker, y) 
            || checkDiagonals(x, y, marker)) {
                return true;
            } else {
                return false;
            }
        }
    }

    const checkLine = (marker, x) => {
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
        return bool;
    }

    const checkColumn = (marker, y) => {
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

    const getStatus = () => {
        return status;
    }

    const getAvailableCells = () => {
        let moves = [];
        gameBoard.forEach((el, index) => {
            for (let i = 0; i < gameBoard.length; i++) {
                if (el[i] === '') {
                    moves.push([index, i])
                }
            }
        });

        console.log(moves);
        return moves;
    }

    return {
        initGameBoard, 
        getCurrentCell, 
        update, 
        getStatus, 
        getAvailableCells
    };
})();



const Player = (name, marker) => {
    let isMyTurn = false;

    return {name, marker, isMyTurn};
}


const Ai = (name, marker) => {
    const prototype = Player(name, marker);

    const play = () => {
        const availableCells = gameBoard.getAvailableCells();
        const randomCoordinates = availableCells[Math.floor(Math.random() * availableCells.length)]
        game.placeMarker(randomCoordinates[0], randomCoordinates[1]);
    }

    return Object.assign({}, prototype, {play});
}