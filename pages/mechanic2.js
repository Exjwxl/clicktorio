export function getMechanic2() {
    return `
<div class="smelting-container">
    <!-- Smelting buttons -->
    <button onclick="startSmelting('ironPlate')">Smelt Iron Plate</button>
    <button onclick="startSmelting('copperPlate')">Smelt Copper Plate</button>
    
    <!-- Active smelting operations will appear here -->
    <div id="active-smelting" class="active-smelting"></div>
</div>
    `;
}