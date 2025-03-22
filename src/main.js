import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createHexGrid } from './map.js';
import { Player } from './player.js';  // Import our new Player class

// Initialize the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xA3D5FF); // light sky blue

// Set up camera for isometric view
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 8, 5); // Position for isometric-like view
camera.lookAt(0, 0, 0);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2.5; // Limit to prevent going below the grid

// Create the hex grid (14x14)
const hexGrid = createHexGrid(14, 14);
scene.add(hexGrid);

// Add ground plane beneath the grid
const groundGeometry = new THREE.PlaneGeometry(18, 18);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x373F51, // charcoal
  roughness: 0.8,
  metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
ground.position.y = -0.2; // Slightly below the grid
scene.add(ground);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create player at grid position (0, 0)
const player = new Player(scene, 0.66, 0.15, 0.5); // Pass hexSize = 0.5

// Set up keyboard controls
const keyStates = {};

window.addEventListener('keydown', (e) => {
  keyStates[e.code] = true;
  
  // Handle movement keys
  switch(e.code) {
    case 'ArrowUp':
    case 'KeyW':
      player.move('up');
      break;
    case 'ArrowDown':
    case 'KeyS':
      player.move('down');
      break;
    case 'ArrowLeft':
    case 'KeyA':
      player.move('left');
      break;
    case 'ArrowRight':
    case 'KeyD':
      player.move('right');
      break;
  }
});

window.addEventListener('keyup', (e) => {
  keyStates[e.code] = false;
});

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  // Update player animation
  player.update();
  
  renderer.render(scene, camera);
}

animate();