import * as THREE from "three";
import * as CANNON from 'cannon-es';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import createBeer, { updateBeer } from "./beer";
import { updateSplashParticles, triggerSplash } from "./particles";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("lightgrey");
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight); 

// Physics setup with realistic parameters
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.8, 0), // Real-world gravity
  allowSleep: false
});
world.broadphase = new CANNON.SAPBroadphase(world);

const solver = new CANNON.GSSolver();
solver.iterations = 20; // Reduced for performance
solver.tolerance = 0.1; // Increased for performance
world.solver = solver;

const glassMaterial = new CANNON.Material("glass");
const contactMaterial = new CANNON.ContactMaterial(
  glassMaterial,
  glassMaterial,
  {
    restitution: 0.4,  // Softer bounces (0 = no bounce, 1 = perfect bounce)
    friction: 0.3,     // More friction between glasses
    contactEquationStiffness: 1e8, // Softer contacts
    contactEquationRelaxation: 3   // More relaxation
  }
);
world.addContactMaterial(contactMaterial);

// UI Setup
const guiContainer = document.createElement('div');
guiContainer.style.position = 'absolute';
guiContainer.style.top = '10px';
guiContainer.style.left = '10px';
guiContainer.style.backgroundColor = 'rgba(255,255,255,0.8)';
guiContainer.style.padding = '10px';
guiContainer.style.borderRadius = '5px';
document.body.appendChild(guiContainer);

// Distance control
const distanceLabel = document.createElement('div');
distanceLabel.textContent = 'Start Distance: 40';
guiContainer.appendChild(distanceLabel);

const distanceSlider = document.createElement('input');
distanceSlider.type = 'range';
distanceSlider.min = '50';
distanceSlider.max = '100';
distanceSlider.value = '50';
distanceSlider.step = '10';
guiContainer.appendChild(distanceSlider);
guiContainer.appendChild(document.createElement('br'));

// Speed control
const speedLabel = document.createElement('div');
speedLabel.textContent = 'Speed: 30.0';
guiContainer.appendChild(speedLabel);

const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '10';
speedSlider.max = '100';
speedSlider.value = '30';
speedSlider.step = '10';
guiContainer.appendChild(speedSlider);
guiContainer.appendChild(document.createElement('br'));

// Gravity control
const gravityLabel = document.createElement('div');
gravityLabel.textContent = 'Gravity: 0';
guiContainer.appendChild(gravityLabel);

const gravitySlider = document.createElement('input');
gravitySlider.type = 'range';
gravitySlider.min = '-10';
gravitySlider.max = '2';
gravitySlider.value = '0';
gravitySlider.step = '1';
guiContainer.appendChild(gravitySlider);
guiContainer.appendChild(document.createElement('br'));

// Tilt controls
const tiltControlsContainer = document.createElement('div');
tiltControlsContainer.style.marginTop = '10px';
tiltControlsContainer.style.borderTop = '1px solid #ccc';
tiltControlsContainer.style.paddingTop = '10px';
guiContainer.appendChild(tiltControlsContainer);

// Left Cup Tilt Controls
const leftTiltLabel = document.createElement('div');
leftTiltLabel.textContent = 'Left Cup Tilt:';
leftTiltLabel.style.fontWeight = 'bold';
tiltControlsContainer.appendChild(leftTiltLabel);

// Left Cup X-Axis (pitch)
const leftTiltXLabel = document.createElement('div');
leftTiltXLabel.textContent = 'Front-Back: 0°';
tiltControlsContainer.appendChild(leftTiltXLabel);

const leftTiltXSlider = document.createElement('input');
leftTiltXSlider.type = 'range';
leftTiltXSlider.min = '-30';
leftTiltXSlider.max = '30';
leftTiltXSlider.value = '0';
leftTiltXSlider.step = '1';
tiltControlsContainer.appendChild(leftTiltXSlider);

// Left Cup Z-Axis (roll)
const leftTiltZLabel = document.createElement('div');
leftTiltZLabel.textContent = 'Side-Side: 0°';
tiltControlsContainer.appendChild(leftTiltZLabel);

const leftTiltZSlider = document.createElement('input');
leftTiltZSlider.type = 'range';
leftTiltZSlider.min = '-30';
leftTiltZSlider.max = '30';
leftTiltZSlider.value = '0';
leftTiltZSlider.step = '1';
tiltControlsContainer.appendChild(leftTiltZSlider);
tiltControlsContainer.appendChild(document.createElement('br'));

// Right Cup Tilt Controls
const rightTiltLabel = document.createElement('div');
rightTiltLabel.textContent = 'Right Cup Tilt:';
rightTiltLabel.style.fontWeight = 'bold';
tiltControlsContainer.appendChild(rightTiltLabel);

// Right Cup X-Axis (pitch)
const rightTiltXLabel = document.createElement('div');
rightTiltXLabel.textContent = 'Front-Back: 0°';
tiltControlsContainer.appendChild(rightTiltXLabel);

const rightTiltXSlider = document.createElement('input');
rightTiltXSlider.type = 'range';
rightTiltXSlider.min = '-30';
rightTiltXSlider.max = '30';
rightTiltXSlider.value = '0';
rightTiltXSlider.step = '1';
tiltControlsContainer.appendChild(rightTiltXSlider);

// Right Cup Z-Axis (roll)
const rightTiltZLabel = document.createElement('div');
rightTiltZLabel.textContent = 'Side-Side: 0°';
tiltControlsContainer.appendChild(rightTiltZLabel);

const rightTiltZSlider = document.createElement('input');
rightTiltZSlider.type = 'range';
rightTiltZSlider.min = '-30';
rightTiltZSlider.max = '30';
rightTiltZSlider.value = '0';
rightTiltZSlider.step = '1';
tiltControlsContainer.appendChild(rightTiltZSlider);

// Action buttons
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';
buttonContainer.style.marginTop = '10px';
guiContainer.appendChild(buttonContainer);

const startButton = document.createElement('button');
startButton.textContent = 'Start';
buttonContainer.appendChild(startButton);

const resetButton = document.createElement('button');
resetButton.textContent = 'Reset';
buttonContainer.appendChild(resetButton);

// Create beer mugs with realistic physics
const leftGlass = createBeer(scene, world);
const rightGlass = createBeer(scene, world);

// Shape configuration
const leftShape = leftGlass.physicsBody.shapes[0] as CANNON.Cylinder;
const rightShape = rightGlass.physicsBody.shapes[0] as CANNON.Cylinder;
leftShape.radiusTop = 10;
leftShape.radiusBottom = 10;
rightShape.radiusTop = 10;
rightShape.radiusBottom = 10;

leftShape.material = glassMaterial;
rightShape.material = glassMaterial;

// More realistic physical properties
leftGlass.physicsBody.mass = 2.0; // Heavier glasses (kg)
rightGlass.physicsBody.mass = 2.0;
leftGlass.physicsBody.linearDamping = 0.4; // Air resistance
rightGlass.physicsBody.linearDamping = 0.4;
leftGlass.physicsBody.angularDamping = 0.4; // Rotational resistance
rightGlass.physicsBody.angularDamping = 0.4;
leftGlass.physicsBody.fixedRotation = false; // Allow natural rotation
rightGlass.physicsBody.fixedRotation = false;

// Initial positions and rotations
leftGlass.physicsBody.position.set(-20, 15, 0);
rightGlass.physicsBody.position.set(20, 15, 0);
leftGlass.object.rotation.set(0, Math.PI, 0); // 180 degrees y-rotation
rightGlass.object.rotation.set(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 20, 15);
scene.add(directionalLight);

camera.position.set(0, 30, 70);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation state
let movementPhase: 'ready' | 'approaching' | 'separating' = 'ready';
let currentSpeed = 0;
let collisionOccurred = false;

// Tilt update functions
function updateLeftCupTilt() {
  const tiltX = parseInt(leftTiltXSlider.value);
  const tiltZ = parseInt(leftTiltZSlider.value);
  leftTiltXLabel.textContent = `Front-Back: ${tiltX}°`;
  leftTiltZLabel.textContent = `Side-Side: ${tiltZ}°`;
  
  leftGlass.object.rotation.set(
    THREE.MathUtils.degToRad(tiltX),
    Math.PI,
    THREE.MathUtils.degToRad(tiltZ)
  );
  
  syncPhysicsToGraphics(leftGlass.object, leftGlass.physicsBody);
}

function updateRightCupTilt() {
  const tiltX = parseInt(rightTiltXSlider.value);
  const tiltZ = parseInt(rightTiltZSlider.value);
  rightTiltXLabel.textContent = `Front-Back: ${tiltX}°`;
  rightTiltZLabel.textContent = `Side-Side: ${tiltZ}°`;
  
  rightGlass.object.rotation.set(
    THREE.MathUtils.degToRad(tiltX),
    0,
    THREE.MathUtils.degToRad(tiltZ)
  );
  
  syncPhysicsToGraphics(rightGlass.object, rightGlass.physicsBody);
}

function updatePositions() {
  const startDistance = parseFloat(distanceSlider.value);
  distanceLabel.textContent = `Start Distance: ${startDistance}`;
  
  leftGlass.object.position.set(-startDistance/2, 15, 0);
  rightGlass.object.position.set(startDistance/2, 15, 0);
  
  leftGlass.object.rotation.set(0, Math.PI, 0);
  rightGlass.object.rotation.set(0, 0, 0);
  
  updateLeftCupTilt();
  updateRightCupTilt();
  
  syncPhysicsToGraphics(leftGlass.object, leftGlass.physicsBody);
  syncPhysicsToGraphics(rightGlass.object, rightGlass.physicsBody);
}

function resetAnimation() {
  movementPhase = 'ready';
  currentSpeed = 0;
  collisionOccurred = false;
  
  leftGlass.physicsBody.velocity.set(0, 0, 0);
  rightGlass.physicsBody.velocity.set(0, 0, 0);
  leftGlass.physicsBody.angularVelocity.set(0, 0, 0);
  rightGlass.physicsBody.angularVelocity.set(0, 0, 0);
  
  world.gravity.set(0, parseFloat(gravitySlider.value), 0);
  updatePositions();
  
  // Reset liquid levels
  leftGlass.liquidLevel = 1.0;
  rightGlass.liquidLevel = 1.0;
  
  // Hide all splash particles
  leftGlass.splashParticles.children.forEach(p => (p as THREE.Mesh).visible = false);
  rightGlass.splashParticles.children.forEach(p => (p as THREE.Mesh).visible = false);
}

function startAnimation() {
  if (movementPhase === 'ready') {
    movementPhase = 'approaching';
    currentSpeed = parseFloat(speedSlider.value);
  }
}

// UI Event Listeners
distanceSlider.addEventListener('input', () => {
  if (movementPhase === 'ready') {
    updatePositions();
  }
});

speedSlider.addEventListener('input', () => {
  const speed = parseFloat(speedSlider.value);
  speedLabel.textContent = `Speed: ${speed.toFixed(1)}`;
});

gravitySlider.addEventListener('input', () => {
  const gravityValue = parseFloat(gravitySlider.value);
  gravityLabel.textContent = `Gravity: ${gravityValue.toFixed(1)}`;
  world.gravity.set(0, gravityValue, 0);
});

leftTiltXSlider.addEventListener('input', updateLeftCupTilt);
leftTiltZSlider.addEventListener('input', updateLeftCupTilt);
rightTiltXSlider.addEventListener('input', updateRightCupTilt);
rightTiltZSlider.addEventListener('input', updateRightCupTilt);

startButton.addEventListener('click', startAnimation);
resetButton.addEventListener('click', resetAnimation);

resetAnimation();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const time = performance.now() / 1000;

  if (movementPhase !== 'ready') {
    world.step(1/60);
  }

  updateBeer(leftGlass, time, delta);
  updateBeer(rightGlass, time, delta);
  updateSplashParticles(leftGlass.splashParticles, delta);
  updateSplashParticles(rightGlass.splashParticles, delta);

  if (leftGlass.foamMesh && rightGlass.foamMesh) {
    leftGlass.foamMesh.rotation.y += 0.01;
    rightGlass.foamMesh.rotation.y += 0.01;
  }

  if (movementPhase === 'approaching') {
    const moveAmount = currentSpeed * delta;
    leftGlass.object.position.x += moveAmount;
    rightGlass.object.position.x -= moveAmount;
    
    syncPhysicsToGraphics(leftGlass.object, leftGlass.physicsBody);
    syncPhysicsToGraphics(rightGlass.object, rightGlass.physicsBody);

    const distanceBetween = leftGlass.object.position.distanceTo(rightGlass.object.position);
    if (distanceBetween <= 18 && !collisionOccurred) {
      handleCollision();
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

function handleCollision() {
  movementPhase = 'separating';
  collisionOccurred = true;

  // Calculate collision intensity
  const relativeVelocity = leftGlass.physicsBody.velocity.vsub(rightGlass.physicsBody.velocity).length();
  const collisionIntensity = Math.min(relativeVelocity / 8, 1.5); // More sensitive to velocity
  
  // Get collision direction and position
  const collisionDirection = new THREE.Vector3().subVectors(
    rightGlass.object.position,
    leftGlass.object.position
  ).normalize();

  // Calculate collision point at the rim of the glasses
  const rimHeight = 25; // Height of beer in glass
  const leftCollisionPos = leftGlass.object.position.clone();
  leftCollisionPos.y += rimHeight;
  const rightCollisionPos = rightGlass.object.position.clone();
  rightCollisionPos.y += rimHeight;

  // Trigger more dramatic splashes
  triggerSplash(leftGlass.splashParticles, leftCollisionPos, collisionIntensity * 1.5, collisionDirection.clone().negate());
  triggerSplash(rightGlass.splashParticles, rightCollisionPos, collisionIntensity * 1.5, collisionDirection);

  // Reduce liquid level more noticeably
  leftGlass.liquidLevel = Math.max(0.4, leftGlass.liquidLevel - (collisionIntensity * 0.15));
  rightGlass.liquidLevel = Math.max(0.4, rightGlass.liquidLevel - (collisionIntensity * 0.15));

  // Visual feedback - push cups back
  const separationSpeed = currentSpeed * 1.5 * collisionIntensity;
  
  leftGlass.physicsBody.velocity.set(-separationSpeed, separationSpeed * 0.3, 0); // Add slight upward motion
  rightGlass.physicsBody.velocity.set(separationSpeed, separationSpeed * 0.3, 0);
  
  // Play sound
  new Audio('./src/clink.mp3').play().catch(console.error);
  
  // Temporarily reduce gravity for bounce effect
  const currentGravity = world.gravity.y;
  world.gravity.set(0, currentGravity * 0.2, 0);
  
  setTimeout(() => {
    world.gravity.set(0, currentGravity, 0);
    setTimeout(resetAnimation, 5500);
  }, 200);
}

function syncPhysicsToGraphics(mesh: THREE.Object3D, body: CANNON.Body) {
  body.position.copy(mesh.position as unknown as CANNON.Vec3);
  body.quaternion.copy(mesh.quaternion as unknown as CANNON.Quaternion);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
animate();