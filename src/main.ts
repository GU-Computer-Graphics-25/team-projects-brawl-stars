import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import createBeer from "./beer";

const targetPositionX: number = -10;
const otherTargetPositionX: number = 10;
const endTargetPositionX: number = -20;
const otherEndTargetPositionX: number = 20;
var glassesTapped: boolean = false;

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

const beer_1 = createBeer();
const beer_2 = createBeer();
beer_1.position.x = 25;
beer_2.position.x = -25;
beer_1.rotation.z = Math.PI / 6;
beer_2.rotation.set(0, (2 * Math.PI) / 2, Math.PI / 6);
scene.add(beer_1);
scene.add(beer_2);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 20, 15);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0xffffff, 2);
backLight.position.set(-15, 20, -30);
scene.add(backLight);

camera.position.set(0, 25, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  
  // Animate foam
  beer_1.children[4].rotation.y += 0.005;
  beer_1.children[4].scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.05;
  beer_1.children[4].scale.z = beer_1.children[4].scale.x;
  beer_2.children[4].rotation.y += 0.005;
  beer_2.children[4].scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.05;
  beer_2.children[4].scale.z = beer_2.children[4].scale.x;

  // Animate glass movement
  if (!glassesTapped) {
    if (beer_1.position.x >= otherTargetPositionX) {
      // Rotate first glass before the "clink"
      if (beer_1.rotation.z >= 0)
        beer_1.rotation.z -= THREE.MathUtils.degToRad(1);
      beer_1.position.x -= 0.5;
    }
    if (beer_2.position.x <= targetPositionX) {
      // Rotate second glass before the "clink"
      if (beer_2.rotation.z >= 0)
        beer_2.rotation.z -= THREE.MathUtils.degToRad(1);
      beer_2.position.x += 0.5;
    }
    if (beer_1.position.x <= otherTargetPositionX || beer_2.position.x >= targetPositionX) {
      glassesTapped = true;
    }
  }
  else if (glassesTapped) {
    if (beer_1.position.x <= otherEndTargetPositionX) {
      if (beer_1.rotation.z != 0)
        beer_1.rotation.z += Math.PI / 180;
      beer_1.position.x += 0.5;
    }
    if (beer_2.position.x >= endTargetPositionX) {
      if (beer_2.rotation.z != 0)
        beer_2.rotation.z += Math.PI / 180;
      beer_2.position.x -= 0.5;
    }
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();