import { gameState } from '../state.js';
import { SMELTING_RECIPES } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';
import { showProgressBar, updateProgressBar, hideProgressBar } from '../ui/progressBar.js';

export class SmeltingSystem {
    constructor() {
        // Defer initialization until after all modules are loaded
        setTimeout(() => this.initializeSystem(), 0);
    }

    initializeSystem() {
        this.smeltingQueues = {}; // Object to hold queues for each recipe
        this.isProcessing = {}; // Flag to track if an operation is in progress for each recipe
        this.buffer = { ...(gameState.smeltingBuffer || {}) }; // Initialize buffer from game state, with fallback
        this.paused = {}; // Track paused state for each recipe queue
        this.currentProgress = {}; // Track progress of current smelting operations
        this.activeTimers = {}; // Store active interval timers

        // Initialize queues and processing flags for each recipe
        for (const [recipeId, recipe] of Object.entries(SMELTING_RECIPES)) {
            this.smeltingQueues[recipeId] = [];
            this.isProcessing[recipeId] = false;
            this.paused[recipeId] = false;
            this.currentProgress[recipeId] = 0;
        }

        // Also initialize any resources that might be in the buffer but not in recipes
        if (this.buffer) {
            for (const resource of Object.keys(this.buffer)) {
                if (!this.smeltingQueues[resource]) {
                    this.smeltingQueues[resource] = [];
                    this.isProcessing[resource] = false;
                    this.paused[resource] = false;
                    this.currentProgress[resource] = 0;
                }
            }
        }

        // Update display after initialization
        this.updateActiveSmeltingDisplay();
    }

    getSpeedMultiplier() {
        let multiplier = 1;
        
        // Apply research effects
        if (gameState.research.completed.includes('basicSmelting')) {
            multiplier *= 1.2; // 20% faster
        }
        if (gameState.research.completed.includes('improvedSmelting')) {
            multiplier *= 1.5; // 50% faster
        }
        
        return multiplier;
    }

    getOutputMultiplier() {
        let multiplier = 1;
        
        // Apply research effects
        if (gameState.research.completed.includes('advancedSmelting')) {
            multiplier *= 2; // Double output
        }
        
        return multiplier;
    }

    saveBuffer() {
        gameState.smeltingBuffer = this.buffer;
        localStorage.setItem('smeltingBuffer', JSON.stringify(this.buffer));
        updateDisplayElements();
    }

    canSmelt(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        // Check resources availability in buffer
        for (const [resource, amount] of Object.entries(recipe.input)) {
            if (!this.buffer[resource] || this.buffer[resource] < amount) {
                return false;
            }
        }
        return true;
    }

    hasSufficientFuel(recipe) {
        // Check if we have enough fuel for the complete operation
        return (gameState.systemValues.smelterFuel || 0) >= recipe.burnValue;
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
            
            this.smeltingQueues[recipeId].push(recipeId);
            this.saveBuffer();
            this.updateActiveSmeltingDisplay(recipeId);
            
            // Try to process queue if not already processing
            if (!this.isProcessing[recipeId]) {
                this.processQueue(recipeId);
            }
            return true;
        }
        return false;
    }

    processQueue(recipeId) {
        if (!this.smeltingQueues[recipeId] || 
            this.smeltingQueues[recipeId].length === 0 || 
            this.isProcessing[recipeId]) {
            return;
        }

        const recipe = SMELTING_RECIPES[recipeId];

        if (!this.hasSufficientFuel(recipe)) {
            this.pauseSmelting(recipeId);
            return;
        }

        this.isProcessing[recipeId] = true;
        this.paused[recipeId] = false;

        // Apply speed multiplier from research
        const speedMultiplier = this.getSpeedMultiplier();
        const processTime = Math.floor(recipe.smeltTime / speedMultiplier);

        // Start progress tracking
        this.currentProgress[recipeId] = 0;
        showProgressBar(recipeId);

        // Clear any existing timer
        if (this.activeTimers[recipeId]) {
            clearInterval(this.activeTimers[recipeId]);
        }

        // Set up progress updates
        const updateInterval = 100; // Update every 100ms
        const progressPerUpdate = (updateInterval / processTime) * 100;

        this.activeTimers[recipeId] = setInterval(() => {
            if (this.paused[recipeId]) return;

            this.currentProgress[recipeId] += progressPerUpdate;
            updateProgressBar(recipeId, this.currentProgress[recipeId]);

            if (this.currentProgress[recipeId] >= 100) {
                this.completeSmelting(recipeId);
            }
        }, updateInterval);

        this.updateActiveSmeltingDisplay(recipeId);
    }

    completeSmelting(recipeId) {
        if (!this.isProcessing[recipeId] || this.smeltingQueues[recipeId].length === 0) return;

        // Remove the completed recipe from the queue
        this.smeltingQueues[recipeId].shift();
        const recipe = SMELTING_RECIPES[recipeId];

        // Clear the timer
        if (this.activeTimers[recipeId]) {
            clearInterval(this.activeTimers[recipeId]);
            delete this.activeTimers[recipeId];
        }

        // Apply research multiplier to output
        const outputMultiplier = this.getOutputMultiplier();
        
        // Add products with multiplier
        for (const [product, amount] of Object.entries(recipe.output)) {
            gameState.smeltedItems[product] = (gameState.smeltedItems[product] || 0) + (amount * outputMultiplier);
        }

        // Safely consume fuel
        if (gameState.systemValues.smelterFuel >= recipe.burnValue) {
            gameState.systemValues.smelterFuel -= recipe.burnValue;
        } else {
            // If somehow we got here without enough fuel, set to 0 instead of negative
            gameState.systemValues.smelterFuel = 0;
            // Pause smelting since we're out of fuel
            this.pauseSmelting(recipeId);
        }

        // Reset processing state
        this.isProcessing[recipeId] = false;
        this.currentProgress[recipeId] = 0;
        hideProgressBar(recipeId);

        // Update display
        updateDisplayElements();
        this.updateActiveSmeltingDisplay(recipeId);

        // Process next item in queue if exists and we have fuel
        if (this.smeltingQueues[recipeId].length > 0) {
            if (this.hasSufficientFuel(recipe)) {
                this.processQueue(recipeId);
            } else {
                this.pauseSmelting(recipeId);
            }
        }
    }

    pauseSmelting(recipeId) {
        if (this.activeTimers[recipeId]) {
            clearInterval(this.activeTimers[recipeId]);
            delete this.activeTimers[recipeId];
        }
        this.paused[recipeId] = true;
        this.updateActiveSmeltingDisplay(recipeId);
    }

    resumeSmeltingIfPossible(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return;

        if (this.hasSufficientFuel(recipe)) {
            this.processQueue(recipeId);
        }
    }

    updateActiveSmeltingDisplay(recipeId) {
        const container = document.getElementById('active-smelting');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create a list of all active smelting operations
        for (const [queueId, queue] of Object.entries(this.smeltingQueues)) {
            if (queue.length > 0) {
                const recipe = SMELTING_RECIPES[queueId];
                if (!recipe) continue; // Skip if recipe not found
                
                const div = document.createElement('div');
                div.className = 'smelting-operation';
                div.setAttribute('data-recipe-id', queueId);
                
                const status = this.paused[queueId] ? 'Paused' : 
                              this.isProcessing[queueId] ? 'Processing' : 
                              'Queued';
                
                const speedMultiplier = this.getSpeedMultiplier();
                const outputMultiplier = this.getOutputMultiplier();
                
                div.innerHTML = `
                    <div class="smelting-header">
                        <span>${recipe.name}</span>
                        <span class="status ${status.toLowerCase()}">${status}</span>
                    </div>
                    <div class="smelting-info">
                        <span>Queue: ${queue.length}</span>
                        <span>Speed: ${speedMultiplier.toFixed(1)}x</span>
                        <span>Output: ${outputMultiplier.toFixed(1)}x</span>
                    </div>
                `;
                container.appendChild(div);
                
                // Re-show progress bar if operation is processing
                if (this.isProcessing[queueId]) {
                    showProgressBar(queueId);
                    updateProgressBar(queueId, this.currentProgress[queueId] || 0);
                }
            }
        }
    }

    checkAndResumeSmelting() {
        for (const recipeId of Object.keys(this.smeltingQueues)) {
            if (this.paused[recipeId]) {
                this.resumeSmeltingIfPossible(recipeId);
            }
        }
    }

    addOre(oreType, amount) {
        if (amount <= 0) return;

        // Check if player has enough resources
        const availableOre = gameState.resources[oreType] || 0;
        if (availableOre < amount) {
            console.log(`Not enough ${oreType} available. Have: ${availableOre}, Need: ${amount}`);
            return;
        }

        // Move ore from inventory to buffer
        this.buffer[oreType] = (this.buffer[oreType] || 0) + amount;
        gameState.resources[oreType] -= amount;

        // Find appropriate smelting recipe for this ore
        for (const [recipeId, recipe] of Object.entries(SMELTING_RECIPES)) {
            if (recipe.input[oreType]) {
                // Calculate how many items we can queue based on the recipe input amount
                const recipeInputAmount = recipe.input[oreType];
                const timesToAdd = Math.floor(amount / recipeInputAmount);
                
                if (timesToAdd > 0) {
                    // Initialize queue for this recipe if it doesn't exist
                    if (!this.smeltingQueues[recipeId]) {
                        this.smeltingQueues[recipeId] = [];
                    }
                    
                    for (let i = 0; i < timesToAdd; i++) {
                        this.startSmelting(recipeId);
                    }
                }
                break;
            }
        }

        this.saveBuffer();
        this.updateActiveSmeltingDisplay(oreType);
    }

    addFuel(amount) {
        gameState.systemValues.smelterFuel += amount;
        this.checkAndResumeSmelting();
        updateDisplayElements();
    }

    reset() {
        // Clear all active timers
        for (const [recipeId, timer] of Object.entries(this.activeTimers)) {
            if (timer) {
                clearInterval(timer);
            }
        }

        // Clear all state
        this.initializeSystem();

        // Clear local storage
        localStorage.removeItem('smeltingBuffer');

        // Update display
        this.updateActiveSmeltingDisplay();
    }
}

// Create and export a single instance
export const smeltingSystem = new SmeltingSystem();