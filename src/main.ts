import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xDD0000);
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
const cylinder_1 = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 30, 32),
  new THREE.MeshBasicMaterial(
    {color: 0x000000}
  )
);
const cylinder_2 = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 30, 32),
  new THREE.MeshBasicMaterial({ color: 0xFFCC00 })
);
cylinder_1.position.x = -30;
cylinder_2.position.x = 30;
scene.add(cylinder_1);
scene.add(cylinder_2);


camera.position.set(0, 20, 100);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate()