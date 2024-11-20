export function getMechanic2() {
    return `
<div class="smelting-container">
    <!-- Smelting buttons -->
    <button onclick="addOre('iron',1)">Smelt Iron Plate</button>
    <button onclick="addOre('copper',1)">Smelt Copper Plate</button>
    <button onclick="smeltingSystem.addFuel(1)">Add 1 Fuel</button>
    <p id="smelterFuel"></p>
    
    <!-- Active smelting operations will appear here -->
    <div id="active-smelting" class="active-smelting"></div>
   <div id="progress-bar-container" style="display: none;">
    <div id="progress-bar" class="progress-bar" style="width: 0%;"></div>
</div>
</div>
</div>
    `;
}