import { gameState } from '../state.js';
import { recipes } from '../items.js';

export class CraftingSystem {
    craft(recipeId) {   
        const recipe = recipes[recipeId];
        if (!recipe) return false;

        // Check if player has enough resources and crafted items
        const hasResources = recipe.inputs.every(input => {
            // Check in resources first
            if (gameState.resources[input.item] !== undefined) {
                return gameState.resources[input.item] >= input.amount;
            }
            // If not in resources, check in craftedItems
            return gameState.craftedItems[input.item] >= input.amount;
        });

        if (hasResources) {
            // Remove input resources/items
            recipe.inputs.forEach(input => {
                // Remove from resources if it exists there
                if (gameState.resources[input.item] !== undefined) {
                    gameState.resources[input.item] -= input.amount;
                } else {
                    // Otherwise remove from craftedItems
                    gameState.craftedItems[input.item] -= input.amount;
                }
            });

            // Add output to craftedItems
            if (!gameState.craftedItems[recipe.output.item]) {
                gameState.craftedItems[recipe.output.item] = 0;
            }
            gameState.craftedItems[recipe.output.item] += recipe.output.amount;

            return true;
        }
        return false;
    }
}