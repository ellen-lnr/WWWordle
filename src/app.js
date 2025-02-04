import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(6);
    const gameContainer = document.querySelector('main');
    if (gameContainer) {
        game.attempts.forEach(attempt => {
            gameContainer.appendChild(attempt.form);
        });
    }
});