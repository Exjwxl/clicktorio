import { recipes } from '../scripts/items.js';
import { assetManager } from '../scripts/systems/assetManager.js';
import { craftingSystem } from '../scripts/systems/crafting.js';

export function getMechanic2() {
    // Set up event listeners for crafting progress
    craftingSystem.on('progressUpdated', ({ recipeId, progress, queueSize }) => {
        const progressDiv = document.getElementById(`${recipeId}-progress`);
        const progressBar = progressDiv?.querySelector('.progress-bar');
        const queueText = document.getElementById(`${recipeId}-queue`);
        
        if (progressDiv && progressBar && queueText) {
            if (queueSize > 0) {
                progressDiv.style.display = 'block';
                progressBar.style.width = `${progress * 100}%`;
                queueText.textContent = `${queueSize} in queue`;
            } else {
                progressDiv.style.display = 'none';
            }
        }
    });

    const recipeCards = Object.entries(recipes).map(([recipeId, recipe]) => {
        const ingredients = Object.entries(recipe.ingredients)
            .map(([itemId, amount]) => `<li>${amount}× ${assetManager.formatDisplayName(itemId)}</li>`)
            .join('');

        return `
        <div class="recipe-card">
            <div class="recipe-header">
                <img src="${recipe.getImage()}" 
                     alt="${recipe.name}"
                     onerror="this.onerror=null; this.src='./assets/images/placeholder.png';">
                <h3>${recipe.name}</h3>
            </div>
            <div class="recipe-info">
                <p class="recipe-description">${recipe.description || 'No description available'}</p>
                <div class="recipe-requirements">
                    <p>Requires:</p>
                    <ul>${ingredients}</ul>
                </div>
                <div class="recipe-controls">
                    <button onclick="window.craftItem('${recipeId}')">Craft</button>
                </div>
                <div class="crafting-progress" id="${recipeId}-progress" style="display: none;">
                    <div class="progress-bar"></div>
                    <span class="queue-count" id="${recipeId}-queue">0 in queue</span>
                </div>
            </div>
        </div>`;
    }).join('');

    return `
    <style>
        .crafting-progress {
            margin-top: 10px;
            background: #ddd;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            height: 20px;
        }
        .progress-bar {
            height: 100%;
            background: #4CAF50;
            width: 0;
            transition: width 0.1s linear;
        }
        .queue-count {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
    <div class="crafting-page">
        <h2>Crafting</h2>
        <div class="crafting-container">
            <div class="recipe-list">
                ${recipeCards}
            </div>
            
            <div class="active-crafting" id="active-crafting">
                <!-- Active crafting operations will appear here -->
            </div>
        </div>
    </div>`;
}