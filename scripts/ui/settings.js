import { updateDisplayElements } from "./display.js";
import { gameState } from "../state.js";
import { saveGame } from "../saveSystem.js";
import { showSaveIndicator } from "./animations.js";

export function manualSave(){

    window.manualSave = () => {
        saveGame();
        showSaveIndicator();
    };
}
  
  // Reset game handler
export function resetGame(){

    window.resetGame = () => {
        if (confirm('Are you sure you want to reset the game? This cannot be undone!')) {
            localStorage.removeItem('clickerGameSave');
            localStorage.removeItem('loreModalShown');
            gameState.reset();
            updateDisplayElements();
            location.reload();
            
        }
    };
}