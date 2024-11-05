import { INITIAL_STATE, MAX_CLICKS } from './config.js';

class GameState {
    constructor() {
        Object.assign(this, INITIAL_STATE);
    }

    addClicks(amount) {
        this.clicks = Math.min(MAX_CLICKS, this.clicks + amount);
    }

    reset() {
        Object.assign(this, INITIAL_STATE);
    }
}

export const gameState = new GameState();