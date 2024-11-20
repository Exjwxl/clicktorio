import { gameState } from '../state.js';
import { SMELTING_RECIPES } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';
import { showProgressBar, updateProgressBar, hideProgressBar } from '../ui/progressBar.js';

export class SmeltingSystem {
    constructor() {
        this.smeltingQueues = {}; // Object to hold queues for each resource type
        this.isProcessing = {}; // Flag to track if an operation is in progress for each resource
        this.buffer = { ...gameState.smeltingBuffer }; // Initialize buffer from game state

        // Initialize queues and processing flags for each resource type
        for (const resource of Object.keys(this.buffer)) {
            this.smeltingQueues[resource] = [];
            this.isProcessing[resource] = false;
        }
    }

    saveBuffer() {
        gameState.smeltingBuffer = this.buffer; // Update game state with current buffer
        localStorage.setItem('smeltingBuffer', JSON.stringify(this.buffer)); // Save buffer to local storage
    }

    canSmelt(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        if (!recipe) return false;

        console.log(`Checking if can smelt ${recipeId}. Current buffer:`, this.buffer);

        for (const [resource, amount] of Object.entries(recipe.input)) {
            if ((this.buffer[resource] || 0) < amount) { // Check buffer instead of gameState
                console.log(`Not enough ${resource} in buffer. Required: ${amount}, Available: ${this.buffer[resource] || 0}`);
                return false;
            }
        }
        return gameState.systemValues.smelterFuel >= recipe.burnValue;
    }

    startSmelting(recipeId) {
        const recipe = SMELTING_RECIPES[recipeId];
        const resource = Object.keys(recipe.input)[0]; // Get the first resource type for this recipe
    
        // Check if we can smelt, but do not return if there is no fuel
        if (!this.canSmelt(recipeId) && gameState.systemValues.smelterFuel < recipe.burnValue) {
            console.log(`Not enough fuel to start smelting for ${recipeId}.`);
            return false; // Do not start smelting if there is not enough fuel
        }
    
        for (const [inputResource, amount] of Object.entries(recipe.input)) {
            this.buffer[inputResource] -= amount; // Remove from buffer
        }
    
        gameState.systemValues.smelterFuel -= recipe.burnValue;
        this.smeltingQueues[resource].push(recipeId); // Add to the specific resource queue
        this.updateActiveSmeltingDisplay(resource);
        this.processQueue(resource); // Start processing the queue for this resource
    
        this.saveBuffer(); // Save buffer after starting smelting
        return true;
    }

    processQueue(resource) {
        const activeSmeltingDiv = document.getElementById('active-smelting');
        // Check if the resource is valid and has a queue
        if (!activeSmeltingDiv || !this.smeltingQueues[resource] || this.smeltingQueues[resource].length === 0 || this.isProcessing[resource]) {
            return;
        }
    
        const recipeId = this.smeltingQueues[resource][0];
        if (!this.canSmelt(recipeId)) {
            console.log(`Not enough resources in buffer to smelt ${recipeId}.`);
            return; // Exit if there are not enough resources in the buffer
        }
    
        const recipe = SMELTING_RECIPES[recipeId];
    
        // Check if there is enough fuel for the smelting operation
        if (gameState.systemValues.smelterFuel < recipe.burnValue) {
            console.log(`Not enough fuel to smelt ${recipeId}.`);
            return; // Exit if there is not enough fuel
        }
    
        this.isProcessing[resource] = true; // Set the flag to indicate processing has started
    
        // Deduct fuel for this smelting operation
        gameState.systemValues.smelterFuel -= recipe.burnValue;
    
        showProgressBar(); // Call this when starting the smelting process
    
        // Define the necessary variables
        const smeltTime = recipe.smeltTime; // Assuming smeltTime is defined in your recipe
        const interval = 100; // Set the interval time in milliseconds
        let elapsedTime = 0; // Initialize elapsed time
    
        const updateProgress = setInterval(() => {
            elapsedTime += interval;
            const progressPercentage = Math.min((elapsedTime / smeltTime) * 100, 100);
            const operationContainers = activeSmeltingDiv.getElementsByClassName(`smelting-operation-${resource}`);
    
            if (operationContainers.length > 0) {
                const progressBar = operationContainers[0].getElementsByClassName('progress-bar')[0];
                if (progressBar) {
                    updateProgressBar(progressPercentage); // Update the progress bar
                }
            }
    
            if (elapsedTime >= smeltTime) {
                clearInterval(updateProgress);
                hideProgressBar(); // Call this when smelting is complete
                this.completeSmelting(recipeId, resource);
            }
        }, interval);
    }

    completeSmelting(recipeId, resource) {
        const recipe = SMELTING_RECIPES[recipeId];
        for (const [item, amount] of Object.entries(recipe.output)) {
            gameState.updateSmeltedItems(item, amount);
        }

        this.smeltingQueues[resource].shift(); // Remove the completed operation from the queue
        this.updateActiveSmeltingDisplay(resource);
        this.isProcessing[resource] = false; // Reset the flag to indicate processing is complete

        // Process the next operation in the queue for this resource
        this.processQueue(resource);
        this.saveBuffer(); // Save buffer after completing smelting
    }

    updateActiveSmeltingDisplay(resource) {
        const activeSmeltingDiv = document.getElementById('active-smelting');
        activeSmeltingDiv.innerHTML = ''; // Clear previous content
    
        // Check if the resource has a queue
        if (!this.smeltingQueues[resource]) {
            activeSmeltingDiv.textContent = `No active smelting operations for ${resource}.`;
            return;
        }
    
        if (this.smeltingQueues[resource].length === 0) {
            activeSmeltingDiv.textContent = `No active smelting operations for ${resource}.`;
            return;
        }
    
        // Display the number of operations waiting in the queue
        activeSmeltingDiv.textContent = `Waiting for ${this.smeltingQueues[resource].length} operation(s) to complete for ${resource}.`;
    
        // Create a container for the current operation
        const currentRecipeId = this.smeltingQueues[resource][0];
        const currentRecipe = SMELTING_RECIPES[currentRecipeId];
    
        const operationContainer = document.createElement('div');
        operationContainer.classList.add('smelting-operation', `smelting-operation-${resource}`);
    
        const itemDisplay = document.createElement('div');
        itemDisplay.textContent = `Smelting ${currentRecipeId}`;
        operationContainer.appendChild(itemDisplay);
    
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('smelting-progress');
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.style.width = '0%'; // Start with 0% width
        progressBarContainer.appendChild(progressBar);
        operationContainer.appendChild(progressBarContainer);
    
        activeSmeltingDiv.appendChild(operationContainer);
    }
    addFuel(amount) {
        if (amount > 0) {
            const coalAvailable = gameState.resources.coal || 0;
            if (coalAvailable < amount) return;
    
            gameState.updateResource('coal', -amount);
            gameState.systemValues.smelterFuel += amount;
    
            // Process the queue for all resources after adding fuel
            for (const resource of Object.keys(this.smeltingQueues)) {
                this.processQueue(resource);
            }
            updateDisplayElements();
        }
    }

    addOre(oreType, amount) {
        if (amount > 0) {
            const availableOre = gameState.resources[oreType] || 0;
            if (availableOre < amount) {
                console.log(`Not enough ${oreType} available. Available: ${availableOre}, Required: ${amount}`);
                return;
            }
    
            // Move ore to buffer
            if (!this.buffer[oreType]) {
                this.buffer[oreType] = 0; // Initialize buffer if it doesn't exist
            }
            this.buffer[oreType] += amount; // Add to buffer
    
            console.log(`Added ${amount} ${oreType} to buffer. Current buffer:`, this.buffer);
    
            gameState.updateResource(oreType, -amount); // Remove from game state
            const recipeId = this.getRecipeIdForOre(oreType);
            if (recipeId) {
                // Add the recipe to the smelting queue regardless of fuel
                this.smeltingQueues[oreType].push(recipeId);
                console.log(`Added ${recipeId} to smelting queue for ${oreType}.`);
    
                // Always attempt to start smelting if there is enough fuel
                this.processQueue(oreType); // Start processing the queue for this resource
            }
            this.saveBuffer(); // Save buffer after adding ore
        }
    }
    getRecipeIdForOre(oreType) {
        for (const [recipeId, recipe] of Object.entries(SMELTING_RECIPES)) {
            if (recipe.input[oreType]) {
                return recipeId;
            }
        }
        return null;
    }
}