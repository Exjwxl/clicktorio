import { gameState } from '../state.js';
import { recipes } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';
import { EventEmitter } from '../eventEmitter.js';

export class CraftingSystem {
    constructor() {
        this.craftingQueue = new Map(); // recipeId -> Array<{progress: number, startTime: number, craftTime: number}>
        this.activeRecipes = new Map(); // recipeId -> {timer, progress}
        this.events = new Map();
        this.maxQueueSize = 10; // Maximum items per recipe in queue
        this.eventEmitter = new EventEmitter();
        
        // Start the crafting loop
        setInterval(() => this.processCraftingQueue(), 100);
    }

    // Event System
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    emit(event, data) {
        const callbacks = this.events.get(event) || [];
        callbacks.forEach(callback => callback(data));
    }

    // ID conversion helpers
    toStateId(id) {
        // Convert kebab-case to camelCase (e.g., 'red-science' to 'redScience')
        return id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    // Resource Management
    checkResourceAvailability(item, amount) {
        const stateId = this.toStateId(item);
        return (gameState.resources[stateId] || 0) >= amount ||
               (gameState.craftedItems[stateId] || 0) >= amount ||
               (gameState.smeltedItems[stateId] || 0) >= amount;
    }

    deductResource(item, amount) {
        const stateId = this.toStateId(item);
        if (gameState.smeltedItems[stateId] !== undefined) {
            gameState.smeltedItems[stateId] -= amount;
            return true;
        } else if (gameState.craftedItems[stateId] !== undefined) {
            gameState.craftedItems[stateId] -= amount;
            return true;
        } else if (gameState.resources[stateId] !== undefined) {
            gameState.resources[stateId] -= amount;
            return true;
        }
        return false;
    }

    addResource(item, amount) {
        const stateId = this.toStateId(item);
        if (gameState.smeltedItems[stateId] !== undefined) {
            gameState.smeltedItems[stateId] += amount;
            return true;
        } else if (gameState.craftedItems[stateId] !== undefined) {
            gameState.craftedItems[stateId] += amount;
            return true;
        } else if (gameState.resources[stateId] !== undefined) {
            gameState.resources[stateId] += amount;
            return true;
        }
        return false;
    }

    // Queue Management
    addToQueue(recipeId) {
        const recipe = recipes[recipeId];
        if (!recipe) return false;

        // Check queue size
        const currentQueue = this.craftingQueue.get(recipeId) || [];
        if (currentQueue.length >= this.maxQueueSize) return false;

        // Check resources
        for (const [item, amount] of Object.entries(recipe.ingredients)) {
            if (!this.checkResourceAvailability(item, amount)) {
                return false;
            }
        }

        // Deduct resources
        for (const [item, amount] of Object.entries(recipe.ingredients)) {
            this.deductResource(item, amount);
        }

        // Add to queue
        const craftingItem = {
            progress: 0,
            startTime: Date.now(),
            craftTime: recipe.craftTime
        };

        this.craftingQueue.set(recipeId, [...(currentQueue), craftingItem]);
        this.emit('queueUpdated', { recipeId, queue: this.craftingQueue.get(recipeId) });
        
        updateDisplayElements();
        return true;
    }

    processCraftingQueue() {
        for (const [recipeId, queue] of this.craftingQueue.entries()) {
            if (!queue.length) continue;

            const currentItem = queue[0];
            const recipe = recipes[recipeId];
            
            if (!currentItem || !recipe) continue;

            const elapsedTime = Date.now() - currentItem.startTime;
            const progress = Math.min(1, elapsedTime / currentItem.craftTime);
            
            currentItem.progress = progress;

            if (progress >= 1) {
                // Crafting complete
                queue.shift();
                this.craftingQueue.set(recipeId, queue);
                
                // Add crafted item to state using camelCase
                const stateId = this.toStateId(recipeId);
                if (recipe.type === 'craftedItem') {
                    gameState.craftedItems[stateId] = (gameState.craftedItems[stateId] || 0) + 1;
                }
                
                this.emit('craftingComplete', { recipeId });
                updateDisplayElements();
            }

            this.emit('progressUpdated', { 
                recipeId, 
                progress,
                queueSize: queue.length
            });
        }
    }

    getProgress(recipeId) {
        const queue = this.craftingQueue.get(recipeId);
        if (!queue || !queue.length) return 0;
        return queue[0].progress;
    }

    getQueueSize(recipeId) {
        const queue = this.craftingQueue.get(recipeId);
        return queue ? queue.length : 0;
    }
}

export const craftingSystem = new CraftingSystem();