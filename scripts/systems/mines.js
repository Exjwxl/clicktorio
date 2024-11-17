import { gameState } from "../state.js";

export function mines(){
    const efficiency = gameState.systemValues.efficiency;
    window.mineIron = () => {
        gameState.updateResource('iron',efficiency);
    };
    
    window.mineStone = () => {
        gameState.updateResource('stone',efficiency);
    };
    
    window.mineCopper = () => {
        gameState.updateResource('copper',efficiency);
    };
    
    window.mineCoal = () => {
        gameState.updateResource('coal',efficiency);
    };
}