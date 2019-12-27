const BabylonGame = require('./modules/BabylonGame');

const main = () => {
    const canvas = document.getElementById('game'); // Get the canvas element 
    const babylonGame = new BabylonGame(canvas);
    babylonGame.init();
}

main();