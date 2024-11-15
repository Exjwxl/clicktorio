import { formatNumber } from "./formatters.js";
import { gameState } from "./state.js";



export function updateDisplayElements() {
    document.getElementById('ironOre').innerHTML = `Iron Ore: ${formatNumber(gameState.resources.iron)}`;

    document.getElementById('stone').innerHTML = `Stone: ${formatNumber(gameState.resources.stone)}`;
    
    document.getElementById('copperOre').innerHTML = `Copper Ore: ${formatNumber(gameState.resources.copper)}`;
    
    document.getElementById('coal').innerHTML = `Coal: ${formatNumber(gameState.resources.coal)}`;
    
    document.getElementById('efficiency').innerHTML = `Efficiency: ${formatNumber(gameState.efficiency)}`;
    
    document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = 
        `Auto Clicker Upgrade Cost: ${formatNumber(gameState.autoClickerUpgradeCost)}`;
    

}