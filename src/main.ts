import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import createBeer from "./beer";

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

const beer = createBeer();
scene.add(beer);

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
  beer.children[4].rotation.y += 0.005;
  beer.children[4].scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.05;
  beer.children[4].scale.z = beer.children[1].scale.x;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();