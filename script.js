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
    var playerList = [];
    var markers = ['X', 'O']

    const start = () => {
        console.log('start');
        createPlayers();
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
                const newPlayer = Player(`Player ${i+1}`, markers[i])
                playerList.push(newPlayer);
            }
        }
        console.log(playerList);
    }
    
    return {start, restart, quit};
})();


const gameBoard = (() => {
    let gameBoard = [];
})();


const Player = (name, marker) => {
    return {name, marker};
}



// game.createPlayers();