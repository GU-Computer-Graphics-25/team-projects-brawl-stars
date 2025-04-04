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
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(createMug())

const light = new THREE.DirectionalLight(0xfff0dd, 1);
scene.add(light);
camera.position.set(0, 20, 100);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate()