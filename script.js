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
    let currentTurn = '';
    const markers = ['X', 'O']

    const start = () => {
        console.log('start');
        createPlayers();
        gameBoard.initGrid();
        console.log(gameBoard.domGrid);
    }
    
    const restart = () => {
        console.log('restart');
    }
    
    const quit = () => {
        console.log('quit');
        
    }
    
    const createPlayers = () => {
        if (playerList.length === 0) {
            for (let i = 0; i < 2; i++) {    
                const newPlayer = Player(
                    `Player ${i+1}`,
                    markers[i],
                    gameBoard.domGrid
                    );
                playerList.push(newPlayer);
            }
        }
        console.log(playerList);
    }
    
    return {start, restart, quit};
})();



const gameBoard = (() => {
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    //cache dom
    const initGrid = () => {    
        const domGrid = document.querySelectorAll('.grid-cell');
        console.log('domgrid = ' + domGrid);
        // domGrid.forEach(el => addEventListener('click', () => {}))
        return domGrid;
    }

    const updateDisplay = () => {
        return;
    }

    return {updateDisplay, initGrid}
})();



const Player = (name, marker, grid) => {
    let isMyTurn = false;

    const placeMarker = () => {
        
    }

    return {name, marker, grid};
}

console.log(gameBoard.initGrid());