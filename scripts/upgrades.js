import { gameState } from './state.js';

export function handleUpgrade() {
    if (gameState.clicks >= gameState.upgradeCost) {
        gameState.clicks -= gameState.upgradeCost;
        gameState.upgrade *= 2;
        gameState.upgradeCost = Math.floor(gameState.upgradeCost * 1.5);
        return true;
    } else {
        alert(`You need ${gameState.upgradeCost - gameState.clicks} more clicks to upgrade!`);
        return false;
    }
}