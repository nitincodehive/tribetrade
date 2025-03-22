import * as THREE from 'three';

// Tile types with their colors
const TILE_TYPES = {
  PLAINS: { color: 0x8CC7A1, probability: 0.5 },  // wheat
  DESERT: { color: 0xD8B4A0, probability: 0.3 },  // desert sand
  RIVER: { color: 0x0F8B8D, probability: 0.2 }    // dark cyan
};

// Generate a random tile type based on probability
function getRandomTileType() {
  const rand = Math.random();
  let cumulativeProbability = 0;
  
  for (const type in TILE_TYPES) {
    cumulativeProbability += TILE_TYPES[type].probability;
    if (rand <= cumulativeProbability) {
      return TILE_TYPES[type];
    }
  }
  
  return TILE_TYPES.PLAINS; // Default fallback
}

// Create a single hexagon tile
function createHexagonTile(type, size = 1) {
  // Create a hexagon shape
  const hexGeometry = new THREE.CylinderGeometry(size, size, 0.2, 6, 1);
  
  // Rotate the geometry to lie flat
  hexGeometry.rotateX(0); // No rotation needed for flat alignment
  
  // Create material with the tile's color
  const material = new THREE.MeshStandardMaterial({ 
    color: type.color,
    flatShading: true
  });
  
  // Create the tile mesh
  const tile = new THREE.Mesh(hexGeometry, material);
  
  // Rotate the tile around the Y-axis to align properly
  tile.rotation.y = Math.PI / 6; // Rotate 30 degrees to interlock hexagons
  
  // Add wireframe outline
  const edges = new THREE.EdgesGeometry(hexGeometry);
  const wireframe = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 })
  );
  wireframe.position.z = 0.01; // Slight offset to prevent z-fighting
  tile.add(wireframe);
  
  return tile;
}

// Generate the entire hex grid
export function createHexGrid(width, height) {
  const group = new THREE.Group();
  const hexSize = 0.5; // Size of each hexagon
  
  // Offset calculations for a proper hex grid
  const xOffset = hexSize * 1.5;
  const zOffset = hexSize * Math.sqrt(3);
  
  // Define a clustering pattern
  const clusterSize = 3; // Number of tiles in a cluster
  let currentTileType = getRandomTileType(); // Start with a random tile type
  let clusterCounter = 0; // Counter to track cluster size

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < height; z++) {
      // Switch to a new tile type after the cluster size is reached
      if (clusterCounter >= clusterSize) {
        currentTileType = getRandomTileType();
        clusterCounter = 0; // Reset the counter
      }

      // Create a tile with the current tile type
      const tile = createHexagonTile(currentTileType, hexSize);

      // Position the tile - offset every other row for hex grid pattern
      tile.position.x = x * xOffset;
      tile.position.z = z * zOffset + (x % 2) * (zOffset / 2);

      // Adjust the y position to ensure the tile sits on the ground
      tile.position.y = 0.1; // Half the height of the hexagon (0.2 / 2)

      // Add the tile to our group
      group.add(tile);

      // Increment the cluster counter
      clusterCounter++;
    }
  }
  
  // Center the grid
  group.position.x = -(width * xOffset) / 2 + hexSize;
  group.position.z = -(height * zOffset) / 2;
  
  return group;
}