import { Answer } from './Answer.js';

export class Game {
    constructor(maxAttempts) {
        this.attempts = [];
        this.currentAttemptIndex = 0;
        this.messageElement = document.createElement('div');
        this.messageElement.className = 'message';
        document.body.insertBefore(this.messageElement, document.querySelector('main'));
        
        for (let i = 0; i < maxAttempts; i++) {
            this.attempts.push(new Answer(this, i));
        }
        
        this.attempts[0].activate();
    }

    nextAttempt() {
        this.attempts[this.currentAttemptIndex].deactivate();
        this.currentAttemptIndex++;
        if (this.currentAttemptIndex >= this.attempts.length) {
            this.gameOver();
        } else {
            this.attempts[this.currentAttemptIndex].activate();
        }
    }

    showMessage(message) {
        this.messageElement.textContent = message;
    }

    gameOver() {
        this.showMessage('Game Over!');
    }

    victory() {
        this.showMessage('Congratulations!');
        this.attempts.forEach(attempt => attempt.deactivate());
    }
}

