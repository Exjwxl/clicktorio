import { RESEARCH_CONFIG } from '../config.js';
import { gameState } from '../state.js';
import { updateDisplayElements } from '../ui/display.js';

class ResearchSystem {
    constructor() {
        this.activeResearch = null;
        this.progressInterval = null;
    }

    canStartResearch(researchId) {
        const research = RESEARCH_CONFIG[researchId];
        if (!research) return false;

        // Check if already completed
        if (gameState.research.completed.includes(researchId)) return false;

        // Check requirements
        if (research.requires) {
            for (const req of research.requires) {
                if (!gameState.research.completed.includes(req)) return false;
            }
        }

        // Check resources
        for (const [resource, amount] of Object.entries(research.cost)) {
            // Check in different resource pools based on the resource type
            const resourceAmount = 
                gameState.smeltedItems[resource] || // Check smelted items
                gameState.craftedItems[resource] || // Check crafted items
                gameState.resources[resource] || // Check raw resources
                0;
            
            if (resourceAmount < amount) {
                console.log(`Not enough ${resource}. Have: ${resourceAmount}, Need: ${amount}`);
                return false;
            }
        }

        return true;
    }

    startResearch(researchId) {
        if (!this.canStartResearch(researchId)) return false;
        if (gameState.research.inProgress) return false;

        const research = RESEARCH_CONFIG[researchId];
        
        // Deduct costs from appropriate resource pools
        for (const [resource, amount] of Object.entries(research.cost)) {
            if (gameState.smeltedItems[resource] !== undefined) {
                gameState.smeltedItems[resource] -= amount;
            } else if (gameState.craftedItems[resource] !== undefined) {
                gameState.craftedItems[resource] -= amount;
            } else if (gameState.resources[resource] !== undefined) {
                gameState.resources[resource] -= amount;
            }
        }

        // Start research
        gameState.research.inProgress = researchId;
        gameState.research.progress = 0;
        
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 100);

        this.updateResearchDisplay();
        return true;
    }

    updateProgress() {
        if (!gameState.research.inProgress) return;

        const research = RESEARCH_CONFIG[gameState.research.inProgress];
        gameState.research.progress += 100;

        if (gameState.research.progress >= research.timeRequired) {
            this.completeResearch();
        }

        this.updateResearchDisplay();
    }

    completeResearch() {
        const researchId = gameState.research.inProgress;
        const research = RESEARCH_CONFIG[researchId];

        // Add to completed research
        gameState.research.completed.push(researchId);

        // Unlock new research
        if (research.unlocks) {
            gameState.research.unlocked.push(...research.unlocks);
        }

        // Clear progress
        gameState.research.inProgress = null;
        gameState.research.progress = 0;
        clearInterval(this.progressInterval);

        this.updateResearchDisplay();
    }

    getResearchProgress() {
        if (!gameState.research.inProgress) return 0;
        const research = RESEARCH_CONFIG[gameState.research.inProgress];
        return (gameState.research.progress / research.timeRequired) * 100;
    }

    updateResearchDisplay() {
        const availableResearch = document.getElementById('available-research');
        const researchProgress = document.getElementById('research-progress');
        
        if (!availableResearch || !researchProgress) return;

        // Clear existing content
        availableResearch.innerHTML = '';
        researchProgress.innerHTML = '';

        // Show available research
        for (const [researchId, research] of Object.entries(RESEARCH_CONFIG)) {
            if (!gameState.research.unlocked.includes(researchId)) continue;
            if (gameState.research.completed.includes(researchId)) continue;

            const researchElement = document.createElement('div');
            researchElement.className = 'research-item';
            
            const canStart = this.canStartResearch(researchId);
            if (!canStart) {
                researchElement.classList.add('disabled');
            }

            // Get current resource amounts
            const resourceStatus = Object.entries(research.cost).map(([resource, amount]) => {
                const current = 
                    gameState.smeltedItems[resource] ||
                    gameState.craftedItems[resource] ||
                    gameState.resources[resource] ||
                    0;
                return `<span class="${current >= amount ? 'sufficient' : 'insufficient'}">${resource}: ${current}/${amount}</span>`;
            }).join(' ');

            researchElement.innerHTML = `
                <h3>${research.name}</h3>
                <p>${research.description}</p>
                <div class="research-cost">
                    ${resourceStatus}
                </div>
            `;

            if (canStart) {
                researchElement.onclick = () => this.startResearch(researchId);
            }

            availableResearch.appendChild(researchElement);
        }

        // Show current research progress
        if (gameState.research.inProgress) {
            const research = RESEARCH_CONFIG[gameState.research.inProgress];
            const progress = this.getResearchProgress();

            researchProgress.innerHTML = `
                <div class="research-progress">
                    <h3>Researching: ${research.name}</h3>
                    <div class="research-progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                    <p>${Math.floor(progress)}% complete</p>
                </div>
            `;
        }
    }
}

export const researchSystem = new ResearchSystem();