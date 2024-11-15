export function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    if (num <=1e3) return Number(num).toFixed(2).replace(/\.00$/, '');

    return num.toLocaleString();
  }

export function updateDisplayElements() {
    document.getElementById('ironOre').innerHTML = `Iron Ore: ${formatNumber(gameState.resources.iron)} (+ ${formatNumber(gameState.efficiency)})`;
    document.getElementById('stone').innerHTML = `Stone: ${formatNumber(gameState.resources.stone)} (+ ${formatNumber(gameState.efficiency)})`;
    document.getElementById('copperOre').innerHTML = `Copper Ore: ${formatNumber(gameState.resources.copper)} (+ ${formatNumber(gameState.efficiency)})`;
    document.getElementById('coal').innerHTML = `Coal: ${formatNumber(gameState.resources.coal)} (+ ${formatNumber(gameState.efficiency)})`;
    document.getElementById('upgradeCostDisplay').innerHTML = `Upgrade Cost: ${formatNumber(gameState.upgradeCost)}`;
    document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = 
        `Auto Clicker Upgrade Cost: ${formatNumber(gameState.autoClickerUpgradeCost)}`;
    
}


export function setTheme(theme) {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme || (currentTheme === 'Dark' ? 'Light' : 'Dark');
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // Save the theme preference
  document.getElementById('toggleTheme').innerHTML = `Change theme to ${newTheme === 'Dark' ? 'Light' : 'Dark'} `;

}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'Light'; // Default to light theme
  setTheme(savedTheme);
});


  