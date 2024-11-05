import {gameState} from 'module';

export function updateDisplayElements(){
    document.getElementById('score').innerHTML = `Clicks: ${formatNumber(gameState.clicks)}`; 
    document.getElementById('upgradeCostDisplay').innerHTML = `Upgrade Cost: ${formatNumber(gameState.upgradeCost)}`;
    document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = `${formatNumber(gameState.autoClickerUpgradeCost)}`;    
    debug()  
  }

  export function debug(){
    console.log('Clicks:', formatNumber(gameState.clicks));
    console.log('Upgrade:', formatNumber(gameState.upgrade));
    console.log('Upgrade Cost:', formatNumber(gameState.upgradeCost));
    console.log('Auto Clicker Active:', gameState.autoClickerActive);
    console.log('Auto Clicker Speed:', gameState.autoClickerSpeed);
    console.log('Auto Clicker Upgrade Cost:',formatNumber( gameState.autoClickerUpgradeCost));
  }