import { INITIAL_STATE, MAX_CLICKS } from './config.js';
import { updateDisplayElements } from './ui/display.js';

class GameState {
    constructor() {
        Object.assign(this, INITIAL_STATE);
    }

    updateResource(resourceName, amount) {
        this.resources[resourceName] = this.resources[resourceName] + amount;
        updateDisplayElements()
    }

    updateCraftedItems(craftedItems, amount) {
        this.craftedItems[craftedItems] = this.craftedItems[craftedItems] + amount;
        updateDisplayElements();
    }

    reset() {
        Object.assign(this, INITIAL_STATE);
    }
}

export const gameState = new GameState();