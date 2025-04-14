import * as THREE from "three";

export default function createBeer() {
  const object = new THREE.Object3D();
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
    side: THREE.DoubleSide, // Important for interior visibility
  });
  const beer = new THREE.Mesh(beerGeometry, beerMaterial);
  beer.position.y = beerHeight / 2 - 10; // Center in glass
  object.add(beer);

  // Foam adjustment
  const foamGeometry = new THREE.CylinderGeometry(8.0, 8.0, 1, 32);
  const foamMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfff5e1,
    roughness: 0.5,
    transmission: 0.1,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
  const foam = new THREE.Mesh(foamGeometry, foamMaterial);
  foam.position.y = beerHeight - 10; // Position at top of beer
  foam.name = "foam"
  object.add(foam);
  return object;
}