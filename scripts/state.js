import { INITIAL_STATE, MAX_CLICKS } from './config.js';
import { updateDisplayElements } from './ui/display.js';
import { smeltingSystem } from './systems/smelting.js';

class GameState {
    constructor() {
        Object.assign(this, INITIAL_STATE);
    }

    updateResource(resourceName, amount) {
        if (!this.resources.hasOwnProperty(resourceName)) {
            console.error(`Invalid resource: ${resourceName}`);
            return false;
        }
        const newAmount = this.resources[resourceName] + amount;
        if (newAmount < 0) {
            console.error(`Cannot reduce ${resourceName} below 0`);
            return false;
        }
        this.resources[resourceName] = newAmount;
        updateDisplayElements();
        return true;
    }

    updateCraftedItems(craftedItems, amount) {
        this.craftedItems[craftedItems] = (this.craftedItems[craftedItems] || 0) + amount;
        updateDisplayElements();
    }

    updateSmeltedItems(smeltedItems, amount) {
        this.smeltedItems[smeltedItems] = (this.smeltedItems[smeltedItems] || 0) + amount;
        console.log(`Updated ${smeltedItems}:`, this.smeltedItems[smeltedItems]); // Log the updated value
        updateDisplayElements();
    }

    reset() {
        Object.assign(this, JSON.parse(JSON.stringify(INITIAL_STATE)));
        // Defer smelting system reset to avoid circular dependency issues
        setTimeout(() => {
            if (smeltingSystem && typeof smeltingSystem.reset === 'function') {
                smeltingSystem.reset();
            }
        }, 0);
    }
}

export const gameState = new GameState();