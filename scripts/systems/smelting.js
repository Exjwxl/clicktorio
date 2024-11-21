import { gameState } from '../state.js';
import { SMELTING_RECIPES } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';
import { showProgressBar, updateProgressBar, hideProgressBar } from '../ui/progressBar.js';

export class SmeltingSystem {
    constructor() {
        this.smeltingQueues = {}; // Object to hold queues for each resource type
        this.isProcessing = {}; // Flag to track if an operation is in progress for each resource
        this.buffer = { ...gameState.smeltingBuffer }; // Initialize buffer from game state
        this.paused = {}; // Track paused state for each resource queue
        this.currentProgress = {}; // Track progress of current smelting operations
        this.activeTimers = {}; // Store active interval timers

        // Initialize queues and processing flags for each resource type
        for (const recipe of Object.values(SMELTING_RECIPES)) {
            const resource = Object.keys(recipe.input)[0];
            this.smeltingQueues[resource] = [];
            this.isProcessing[resource] = false;
            this.paused[resource] = false;
            this.currentProgress[resource] = 0;
        }

        // Also initialize any resources that might be in the buffer but not in recipes
        for (const resource of Object.keys(this.buffer)) {
            if (!this.smeltingQueues[resource]) {
                this.smeltingQueues[resource] = [];
                this.isProcessing[resource] = false;
                this.paused[resource] = false;
                this.currentProgress[resource] = 0;
            }
        }
    }

    saveBuffer() {
        gameState.smeltingBuffer = this.buffer;
        localStorage.setItem('smeltingBuffer', JSON.stringify(this.buffer));
        updateDisplayElements();
    }

    canSmelt(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        // Check resources availability
        for (const [resource, amount] of Object.entries(recipe.input)) {
            if ((this.buffer[resource] || 0) < amount) {
                return false;
            }
        }
        return true;
    }

    hasSufficientFuel(recipe) {
        return gameState.systemValues.smelterFuel >= recipe.burnValue;
    }

    startSmelting(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        const resource = Object.keys(recipe.input)[0];
        
        // Add to queue even if we can't process it immediately
        if (this.canSmelt(recipeId)) {
            // Deduct resources when adding to queue
            for (const [inputResource, amount] of Object.entries(recipe.input)) {
                this.buffer[inputResource] -= amount;
            }
            
            this.smeltingQueues[resource].push(recipeId);
            this.saveBuffer();
            this.updateActiveSmeltingDisplay(resource);
            
            // Try to process queue if not already processing
            if (!this.isProcessing[resource]) {
                this.processQueue(resource);
            }
            return true;
        }
        return false;
    }

    processQueue(resource) {
        if (!this.smeltingQueues[resource] || 
            this.smeltingQueues[resource].length === 0 || 
            this.isProcessing[resource]) {
            return;
        }

        const recipeId = this.smeltingQueues[resource][0];
        const recipe = SMELTING_RECIPES[recipeId];

        if (!this.hasSufficientFuel(recipe)) {
            this.pauseSmelting(resource);
            return;
        }

        this.isProcessing[resource] = true;
        this.paused[resource] = false;

        // Deduct fuel at the start of processing
        gameState.systemValues.smelterFuel -= recipe.burnValue;
        updateDisplayElements();

        // Create or update progress tracking for this resource
        if (!this.currentProgress[resource]) {
            this.currentProgress[resource] = 0;
        }

        if (!this.activeTimers[resource]) {
            this.activeTimers[resource] = setInterval(() => {
                if (this.paused[resource]) return;

                this.currentProgress[resource] += 100; // Increment by 100ms
                const progressPercentage = Math.min((this.currentProgress[resource] / recipe.smeltTime) * 100, 100);
                
                this.updateActiveSmeltingDisplay(resource);

                if (this.currentProgress[resource] >= recipe.smeltTime) {
                    this.completeSmelting(resource);
                }
            }, 100);
        }
    }

    completeSmelting(resource) {
        if (!this.smeltingQueues[resource] || this.smeltingQueues[resource].length === 0) {
            return;
        }

        const recipeId = this.smeltingQueues[resource].shift();
        const recipe = SMELTING_RECIPES[recipeId];

        // Clear the timer
        if (this.activeTimers[resource]) {
            clearInterval(this.activeTimers[resource]);
            delete this.activeTimers[resource];
        }

        // Add output resources to smelted items
        for (const [outputResource, amount] of Object.entries(recipe.output)) {
            gameState.updateSmeltedItems(outputResource, amount);
            gameState.updateResource(outputResource, amount);
        }

        this.isProcessing[resource] = false;
        this.currentProgress[resource] = 0;
        
        // Update display
        this.updateActiveSmeltingDisplay(resource);
        updateDisplayElements();

        // Process next item in queue if available and has fuel
        if (this.smeltingQueues[resource].length > 0) {
            this.processQueue(resource);
        }
    }

    pauseSmelting(resource) {
        this.paused[resource] = true;
        // Keep the progress but stop processing
        if (this.activeTimers[resource]) {
            clearInterval(this.activeTimers[resource]);
            delete this.activeTimers[resource];
        }
    }

    resumeSmeltingIfPossible(resource) {
        if (this.paused[resource] && this.smeltingQueues[resource].length > 0) {
            const recipeId = this.smeltingQueues[resource][0];
            const recipe = SMELTING_RECIPES[recipeId];
            
            if (this.hasSufficientFuel(recipe)) {
                this.paused[resource] = false;
                this.processQueue(resource);
            }
        }
    }

    updateActiveSmeltingDisplay(resource) {
        const activeSmeltingDiv = document.getElementById('active-smelting');
        if (!activeSmeltingDiv) return;

        // Clear existing display if no resource specified
        if (!resource) {
            activeSmeltingDiv.innerHTML = '';
            for (const res in this.smeltingQueues) {
                this.updateActiveSmeltingDisplay(res);
            }
            return;
        }

        // Ensure the queue exists for this resource
        if (!this.smeltingQueues[resource]) {
            this.smeltingQueues[resource] = [];
            this.isProcessing[resource] = false;
            this.paused[resource] = false;
            this.currentProgress[resource] = 0;
        }

        // Get or create the resource's display div
        let resourceDiv = activeSmeltingDiv.querySelector(`.smelting-operation-${resource}`);
        if (!resourceDiv) {
            resourceDiv = document.createElement('div');
            resourceDiv.className = `smelting-operation-${resource}`;
            activeSmeltingDiv.appendChild(resourceDiv);
        }

        // Calculate progress
        const progressPercentage = this.isProcessing[resource] && this.smeltingQueues[resource].length > 0
            ? (this.currentProgress[resource] / SMELTING_RECIPES[this.smeltingQueues[resource][0]].smeltTime) * 100 
            : 0;

        // Update the resource div content
        resourceDiv.innerHTML = `
            <div class="queue-info">
                <span class="resource-name">${resource}</span>
                <span class="queue-count">${this.smeltingQueues[resource].length} in queue</span>
                ${this.isProcessing[resource] ? 
                    `<div class="progress-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>` 
                    : ''}
            </div>
        `;

        // Remove the div if queue is empty and not processing
        if (this.smeltingQueues[resource].length === 0 && !this.isProcessing[resource]) {
            resourceDiv.remove();
        }
    }

    checkAndResumeSmelting() {
        // Check all paused queues and resume if possible
        for (const resource in this.paused) {
            if (this.paused[resource]) {
                this.resumeSmeltingIfPossible(resource);
            }
        }
    }

    addOre(oreType, amount) {
        if (amount <= 0) return;

        // Ensure the resource exists in our queues
        if (!this.smeltingQueues[oreType]) {
            this.smeltingQueues[oreType] = [];
            this.isProcessing[oreType] = false;
            this.paused[oreType] = false;
            this.currentProgress[oreType] = 0;
        }

        // Check if player has enough resources
        const availableOre = gameState.resources[oreType] || 0;
        if (availableOre < amount) {
            console.log(`Not enough ${oreType} available. Have: ${availableOre}, Need: ${amount}`);
            return;
        }

        // Initialize buffer for this ore type if it doesn't exist
        if (!this.buffer[oreType]) {
            this.buffer[oreType] = 0;
        }

        // Move ore from inventory to buffer
        this.buffer[oreType] += amount;
        gameState.updateResource(oreType, -amount);

        // Find appropriate smelting recipe for this ore
        for (const [recipeId, recipe] of Object.entries(SMELTING_RECIPES)) {
            if (recipe.input[oreType]) {
                // Calculate how many items we can queue based on the recipe input amount
                const recipeInputAmount = recipe.input[oreType];
                const timesToAdd = Math.floor(amount / recipeInputAmount);
                
                for (let i = 0; i < timesToAdd; i++) {
                    this.smeltingQueues[oreType].push(recipeId);
                }

                // Try to start processing if we're not already
                if (!this.isProcessing[oreType]) {
                    this.processQueue(oreType);
                }
                break;
            }
        }

        this.saveBuffer();
        this.updateActiveSmeltingDisplay(oreType);
    }

    addFuel(amount) {
        if (amount <= 0) return;

        const availableFuel = gameState.resources.coal || 0;
        if (availableFuel < amount) {
            console.log(`Not enough coal available. Have: ${availableFuel}, Need: ${amount}`);
            return;
        }

        // Add fuel to the system
        gameState.updateResource('coal', -amount);
        gameState.systemValues.smelterFuel += amount;

        // Try to resume any paused operations
        for (const resource in this.paused) {
            if (this.paused[resource]) {
                this.resumeSmeltingIfPossible(resource);
            }
        }

        updateDisplayElements();
    }
}

// Create and export a single instance
export const smeltingSystem = new SmeltingSystem();