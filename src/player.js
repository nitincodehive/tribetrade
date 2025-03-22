import * as THREE from 'three';

class Player {
  constructor(scene, gridX, gridZ, hexSize = 0.5) {
    this.scene = scene;
    this.gridX = gridX; // Player's position in the grid
    this.gridZ = gridZ;
    this.hexSize = hexSize;

    // Calculate offsets for hexagonal grid
    this.xOffset = hexSize * 1.5;
    this.zOffset = hexSize * Math.sqrt(3);

    // Create the player mesh
    this.mesh = new THREE.Group(); // Group to combine body and hat

    // Create the hexagon-shaped body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 6); // Hexagonal cylinder
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // dark red color
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true; // Enable shadow casting
    body.receiveShadow = true;

    // Create the cube hat
    const hatGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Small cube
    const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray color
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 0.4; // Position the hat on top of the body
    hat.castShadow = true; // Enable shadow casting
    hat.receiveShadow = true;

    // Add body and hat to the player group
    this.mesh.add(body);
    this.mesh.add(hat);

    // Set the player's initial position
    this.updatePosition();

    // Add the player to the scene
    this.scene.add(this.mesh);
  }

  // Update the player's position based on grid coordinates
  updatePosition() {
    // Calculate the X and Z positions based on the grid coordinates
    this.mesh.position.x = this.gridX * this.xOffset;

    // Add staggered offset for odd columns
    this.mesh.position.z = this.gridZ * this.zOffset + (this.gridX % 2) * (this.zOffset / 2);

    // Set the Y position slightly above the ground
    this.mesh.position.y = 0.25; // Adjust to match the height of the body
  }

  // Move the player in a specific direction
  move(direction) {
    switch (direction) {
      case 'up':
        this.gridZ -= 1;
        break;
      case 'down':
        this.gridZ += 1;
        break;
      case 'left':
        this.gridX -= 1;
        break;
      case 'right':
        this.gridX += 1;
        break;
    }

    // Update the player's position after moving
    this.updatePosition();
  }

  // Update logic for animations or other behaviors
  update() {
    // Add any additional update logic here
  }
}

export { Player };