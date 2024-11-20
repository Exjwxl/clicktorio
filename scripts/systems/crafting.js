import { gameState } from '../state.js';
import { recipes } from '../items.js';
import { updateDisplayElements } from '../ui/display.js';

export class CraftingSystem {
    craft(recipeId) {   
        const recipe = recipes[recipeId];
        if (!recipe) {
            console.log('Invalid recipe ID:', recipeId);
            return false;
        }

        // Check if player has enough resources and crafted items
        const hasResources = recipe.inputs.every(input => {
            const availableAmount = gameState.resources[input.item] || 
                                    gameState.craftedItems[input.item] || 
                                    gameState.smeltedItems[input.item] || 0;
            const requiredAmount = input.amount;

            console.log(`Checking ${input.item}: Required = ${requiredAmount}, Available = ${availableAmount}`);
            return availableAmount >= requiredAmount;
        });

        console.log('Crafting recipe:', recipe);
        console.log('Has resources:', hasResources);

        if (hasResources) {
            // Remove input resources/items using update functions
            recipe.inputs.forEach(input => {
                const availableAmount = gameState.resources[input.item] || 
                                        gameState.craftedItems[input.item] || 
                                        gameState.smeltedItems[input.item] || 0;

                if (availableAmount >= input.amount) { // Check if enough resources are available
                    if (gameState.smeltedItems[input.item] !== undefined) {
                        gameState.updateSmeltedItems(input.item, -input.amount);
                    } else if (gameState.craftedItems[input.item] !== undefined) {
                        gameState.updateCraftedItems(input.item, -input.amount);
                    } else if (gameState.resources[input.item] !== undefined) {
                        gameState.updateResource(input.item, -input.amount);
                    }
                } else {
                    console.log(`Not enough ${input.item} to craft. Required: ${input.amount}, Available: ${availableAmount}`);
                }
            });

            // Add output to craftedItems using the update function
            gameState.updateCraftedItems(recipe.output.item, recipe.output.amount);
            console.log('Updated crafted items:', gameState.craftedItems);
            updateDisplayElements();
            return true;
        }
        return false;
    }
}