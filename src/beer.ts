import * as THREE from "three";

export default function createBeer() {
  const object = new THREE.Object3D();
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 30, 32, 1, true)
  );
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1, 12, 48, (Math.PI * 2) / 2)
  );
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(10));
  handle.rotation.z = (3 * Math.PI) / 2;
  handle.position.x = 10;
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -15;
  object.add(cylinder);
  object.add(bottom);
  object.add(handle);
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.97,
        ior: 1.5,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.15,
        thickness: 0.7,
      });
    }
  });
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