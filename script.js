let clicks = 0;
let upgrade = 10;
let upgradeCost = 10;
let autoClickerActive = false;
let autoClickerSpeed = 1000;
let autoClickerUpgradeCost = 100;
let autoClickerInterval = null;

const MAX_CLICKS = 1_000_000_000_000; // 1 trillion


function updateDisplayElements(){
  document.getElementById('score').innerHTML = `Clicks: ${clicks}`; 
  document.getElementById('upgradeCostDisplay').innerHTML = `Upgrade Cost: ${upgradeCost}`;
  document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = `${autoClickerUpgradeCost}`;

  
  debug()
}
function upgradeFn() {
  if (clicks>= upgradeCost) {
    clicks -= upgradeCost; 
    upgrade = upgrade * 2;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateDisplayElements();
  }
  else{
    alert(`You need ${upgradeCost} points to upgrade!`)
  }
}

function clicker() {
  clicks = Math.min(MAX_CLICKS, clicks + upgrade);
  updateDisplayElements();
}

function autoClicker() {
  if (!autoClickerActive) {
    if (clicks >= autoClickerUpgradeCost) {
      clicks -= autoClickerUpgradeCost;
      
      if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
      }
      autoClickerInterval = setInterval(() => {
        clicks = Math.min(MAX_CLICKS, clicks + upgrade);
        updateDisplayElements();
      }, autoClickerSpeed);
      
      autoClickerActive = true;
      document.getElementById("autoClicker").innerHTML = "Stop Auto Clicker";
      updateDisplayElements();
    } else {
      alert(`You need ${autoClickerUpgradeCost} clicks to start auto-clicking!`);
    }
  } else {
    clearInterval(autoClickerInterval);
    autoClickerActive = false;
    document.getElementById("autoClicker").innerHTML = "Start Auto Clicker";
    updateDisplayElements();
  }
}

function autoClickerUpgrade() {
  if (clicks >= autoClickerUpgradeCost) {
    clicks -= autoClickerUpgradeCost;
    autoClickerUpgradeCost = Math.floor(autoClickerUpgradeCost * 2);
    autoClickerSpeed = Math.max(100, autoClickerSpeed * 0.9);
    updateDisplayElements();

    // Restart autoClicker with new speed if it's active
    if (autoClickerActive) {
      clearInterval(autoClickerInterval);
      autoClickerInterval = setInterval(() => {
        clicks += upgrade;
        updateDisplayElements();
      }, autoClickerSpeed);
    }
  } else {
    alert(`You need ${autoClickerUpgradeCost - clicks} more clicks to upgrade Auto Clicker!`);
  }
}

function resetClicks() {
  if (autoClickerInterval) {
    clearInterval(autoClickerInterval);
  }
  
  clicks = 0;
  upgrade = 2;
  upgradeCost = 10;
  autoClickerActive = false;
  autoClickerSpeed = 1000;
  autoClickerUpgradeCost = 100;
  autoClickerInterval = null;
  autoClickerActive = false;

  document.getElementById('autoClicker').innerHTML = "Start AutoClicker!";

  updateDisplayElements()
}

function debug(){
  console.log('Clicks:', clicks);
  console.log('Upgrade:', upgrade);
  console.log('Upgrade Cost:', upgradeCost);
  console.log('Auto Clicker Active:', autoClickerActive);
  console.log('Auto Clicker Speed:', autoClickerSpeed);
  console.log('Auto Clicker Upgrade Cost:', autoClickerUpgradeCost);
}
