import { gameState } from '../state.js';
import { SMELTING_RECIPES } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';

export class SmeltingSystem {
    constructor() {
        this.smeltingQueue = []; // Queue for smelting operations
        this.fuelAmount = 100; // Current fuel amount
    }

    canSmelt(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        // Check if we have enough resources
        for (const [resource, amount] of Object.entries(recipe.input)) {
            if ((gameState.resources[resource] || 0) < amount) {
                console.log(`Not enough ${resource}. Required: ${amount}, Available: ${gameState.resources[resource]}`);
                return false;
            }
        }
        if (this.fuelAmount < recipe.burnValue) {
            console.log('Cannot smelt: insufficient fuel');
            return false;
        }

        return true;
    }

    startSmelting(recipeId) {
        if (!this.canSmelt(recipeId)) {
            console.log(`Cannot smelt: insufficient resources ${gameState.resources} or fuel`);
            return false;
        }

        // Deduct resources using update functions
        const recipe = SMELTING_RECIPES[recipeId];
        for (const [resource, amount] of Object.entries(recipe.input)) {
            gameState.updateResource(resource, -amount); // Use updateResource
        }

        // Deduct fuel
        this.fuelAmount -= recipe.burnValue;

        // Add to queue and process immediately
        this.smeltingQueue.push(recipeId);
        this.processQueue();

        return true;
    }

    processQueue() {
        if (this.smeltingQueue.length === 0) return;

        const recipeId = this.smeltingQueue.shift(); // Get the next recipe to smelt
        const recipe = SMELTING_RECIPES[recipeId];

        // Simulate smelting time
        setTimeout(() => {
            this.completeSmelting(recipeId);
        }, recipe.smeltTime);
    }

    completeSmelting(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];

        // Add output items using update function
        for (const [item, amount] of Object.entries(recipe.output)) {
            gameState.updateSmeltedItems(item, amount); // Use updateSmeltedItems
        }

        console.log(`Completed smelting: ${recipeId}`);
        updateDisplayElements(); // Update UI
    }

    addFuel(amount) {
        if (amount > 0) {
            this.fuelAmount += amount;
            console.log(`Added ${amount} fuel. Total fuel: ${this.fuelAmount}`);
            this.processQueue(); // Check if we can start smelting
            updateDisplayElements(); // Update UI
        } else {
            console.error('Invalid fuel amount:', amount);
        }
    }
} 