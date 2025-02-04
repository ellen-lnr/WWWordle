// Answer.js
export class Answer {
    constructor(game, index) {
        this.game = game;
        this.index = index;
        this.form = document.createElement('form');
        this.form.className = 'row';
        this.form.setAttribute('inert', '');
        this.inputs = [];
        
        for (let i = 0; i < 5; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = 'letter';
            input.name = `letter-${i}`;
            input.setAttribute('required', 'true');
            this.inputs.push(input);
            this.form.appendChild(input);
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.isComplete()) {
                        this.submitGuess();
                    }
                    return;
                }
                
                if (e.key === 'Backspace' && input.value === '' && index > 0) {
                    e.preventDefault();
                    this.inputs[index - 1].focus();
                    this.inputs[index - 1].value = '';
                }
            });

            input.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();
                if (/^[a-z]$/.test(value)) {
                    if (index < this.inputs.length - 1) {
                        this.inputs[index + 1].focus();
                    }
                } else {
                    input.value = '';
                }
            });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitGuess();
        });
    }

    isComplete() {
        return this.inputs.every(input => input.value.length === 1);
    }

    activate() {
        this.form.removeAttribute('inert');
        this.inputs.forEach(input => {
            input.disabled = false;
        });
        this.inputs[0].focus();
    }

    deactivate() {
        this.form.setAttribute('inert', '');
        this.inputs.forEach(input => {
            input.disabled = true;
        });
    }

    async submitGuess() {
        const guess = this.inputs.map(input => input.value).join('').toLowerCase();

        try {
            const response = await fetch('https://progweb-wwwordle-api.onrender.com/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ guess })
            });

            const data = await response.json();

            if (data.status === 'invalid') {
                this.game.showMessage(data.message);
                return;
            }

            data.feedback.forEach((status, index) => {
                this.inputs[index].className = 'letter ' + status;
            });

            if (data.feedback.every(f => f === 'correct')) {
                this.game.victory();
            } else {
                this.game.nextAttempt();
            }
        } catch (error) {
            this.game.showMessage('An error occurred. Please try again.');
        }
    }
}