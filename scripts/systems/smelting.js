import { gameState } from '../state.js';
import { SMELTING_RECIPES } from '../config.js';
import { updateDisplayElements } from '../ui/display.js';

export class SmeltingSystem {
    constructor() {
        this.activeSmeltings = new Map();
        this.smeltingProgress = new Map();
        this.smeltingQueue = new Map(); // Map to hold queues for each recipe

    }

    canSmelt(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        // Check if we have enough resources
        for (const [resource, amount] of Object.entries(recipe.input)) {
            if ((gameState.resources[resource] || 0) < amount) {
                return false;
            }
        }
        return true;
    }

    completeSmelting(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        
        // Add output items
        for (const [item, amount] of Object.entries(recipe.output)) {
            if (!gameState.craftedItems[item] === undefined) {
                gameState.craftedItems[item] = 0;
            }
            gameState.updateCraftedItems(item, amount);
        }
        
        updateDisplayElements();
    }

    startSmelting(recipeId) {
        if (!this.canSmelt(recipeId)) {
            console.log('Cannot smelt: insufficient resources');
            return false;
        }

        // If there's no queue for this recipe, create one
        if (!this.smeltingQueue.has(recipeId)) {
            this.smeltingQueue.set(recipeId, []);
        }

        // Add the smelting operation to the queue
        this.smeltingQueue.get(recipeId).push(Date.now().toString());

        // If this is the first operation in the queue, start processing
        if (this.smeltingQueue.get(recipeId).length === 1) {
            this.processQueue(recipeId);
        }

        this.updateSmeltingDisplay();
        return true;
    }

    processQueue(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        const smeltingId = this.smeltingQueue.get(recipeId)[0]; // Get the first operation in the queue
        const startTime = Date.now();

        // Consume input resources
        for (const [resource, amount] of Object.entries(recipe.input)) {
            gameState.resources[resource] -= amount;
        }

        // Create progress update interval
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed / recipe.smeltTime) * 100;
            this.updateProgress(smeltingId, progress);
        }, 100);

        // Start smelting timer
        const timeoutId = setTimeout(() => {
            this.completeSmelting(recipeId);
            this.smeltingQueue.get(recipeId).shift(); // Remove the completed operation from the queue
            clearInterval(progressInterval);

            // If there are more operations in the queue, process the next one
            if (this.smeltingQueue.get(recipeId).length > 0) {
                this.processQueue(recipeId);
            } else {
                this.updateSmeltingDisplay(); // Update display if queue is empty
            }
        }, recipe.smeltTime);

        // Store all relevant information
        this.activeSmeltings.set(smeltingId, {
            recipeId,
            timeoutId,
            progressInterval,
            startTime
        });

        this.updateSmeltingDisplay();
    }

    cancelSmelting(smeltingId) {
        const smeltingData = this.activeSmeltings.get(smeltingId);
        if (smeltingData) {
            const recipe = SMELTING_RECIPES[smeltingData.recipeId];

            // Refund input resources
            for (const [resource, amount] of Object.entries(recipe.input)) {
                gameState.resources[resource] += amount;
            }

            // Clear timers
            clearTimeout(smeltingData.timeoutId);
            clearInterval(smeltingData.progressInterval);

            // Remove from tracking
            this.activeSmeltings.delete(smeltingId);
            this.smeltingProgress.delete(smeltingId);

            // Remove from the queue
            const queue = this.smeltingQueue.get(smeltingData.recipeId);
            if (queue) {
                const index = queue.indexOf(smeltingId);
                if (index > -1) {
                    queue.splice(index, 1);
                }
            }

            this.updateSmeltingDisplay();
            updateDisplayElements();
            return true;
        }
        return false;
    }

    updateProgress(smeltingId, progress) {
        this.smeltingProgress.set(smeltingId, Math.min(progress, 100));
        this.updateSmeltingDisplay();
    }

    updateSmeltingDisplay() {
        const container = document.getElementById('active-smelting');
        if (!container) {
            console.log('Active smelting container not found');
            return;
        }
    
        container.innerHTML = ''; // Clear the container
    
        // Iterate through each recipe's queue
        this.smeltingQueue.forEach((queue, recipeId) => {
            if (queue.length > 0) {
                const smeltingId = queue[0]; // Get the first operation in the queue
                const progress = this.smeltingProgress.get(smeltingId) || 0;
                const recipe = SMELTING_RECIPES[recipeId];
    
                const smeltingElement = document.createElement('div');
                smeltingElement.className = 'smelting-operation';
                smeltingElement.innerHTML = `
                    <div class="smelting-info">
                        <span>Smelting ${recipeId} (Queue: ${queue.length})</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                        <button onclick="window.cancelSmelt('${smeltingId}')" class="cancel-smelt">Cancel</button>
                    </div>
                `;
                container.appendChild(smeltingElement);
            }
        });
    }
}