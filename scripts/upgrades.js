import { gameState } from './state.js';


export function handleUpgrade() {
    if (gameState.clicks >= gameState.upgradeCost) {
        gameState.clicks -= gameState.upgradeCost;
        gameState.upgrade *= 1.3  ;
        gameState.upgradeCost = Math.floor(gameState.upgradeCost * 1.5);
        return true;
    } else {
        alert(`You need ${Math.ceil(gameState.upgradeCost - gameState.clicks)} more clicks to upgrade!`);
        return false;
    }
}