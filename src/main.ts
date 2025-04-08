import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import createMug from "./mug";

const scene = new THREE.Scene();
scene.background = new THREE.Color("lightgrey");
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

//for the future
const envTexture = new THREE.CubeTextureLoader()
  .setPath('')
  .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
scene.environment = envTexture;

const mug = createMug();
scene.add(mug);

// Beer parameters (adjusted for visibility and fill level)
const beerHeight = 25; // Increased height
const beerGeometry = new THREE.CylinderGeometry(9, 9, beerHeight, 20);
const beerMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xebc100,
  transmission: 0.4, // Reduced transmission for better visibility
  opacity: 0.8,
  roughness: 0.15,
  metalness: 0.0,
  ior: 1.33,
  transparent: true,
  side: THREE.DoubleSide // Important for interior visibility
});
const beer = new THREE.Mesh(beerGeometry, beerMaterial);
beer.position.y = beerHeight/2 - 10; // Center in glass
scene.add(beer);

// Foam adjustment
const foamGeometry = new THREE.CylinderGeometry(8.0, 8.0, 1, 32);
const foamMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xfff5e1,
  roughness: 0.5,
  transmission: 0.1,
  opacity: 0.95,
  side: THREE.DoubleSide
});
const foam = new THREE.Mesh(foamGeometry, foamMaterial);
foam.position.y = beerHeight - 10; // Position at top of beer
scene.add(foam);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 20, 15);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0xffffff, 2);
backLight.position.set(-15, 20, -30);
scene.add(backLight);

camera.position.set(0, 15, 40);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  
  // Animate foam
  foam.rotation.y += 0.005;
  foam.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.05;
  foam.scale.z = foam.scale.x;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();