import * as THREE from "three";

export default function createBeer() {
  const object = new THREE.Object3D();
  const outerCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 30, 32, 1, false)
  );
  const innerCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(9.5, 9.5, 29, 32, 1, false) // Slightly smaller
  );
  innerCylinder.position.y = 0.5; // Adjust for base alignment
  object.add(outerCylinder);
  object.add(innerCylinder);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1, 12, 48, (Math.PI * 2) / 2)
  );
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(10));
  handle.rotation.z = (3 * Math.PI) / 2;
  handle.position.x = 10;
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -15;

  object.add(bottom);
  object.add(handle);
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,  // down to 0 for my realistic glass
        roughness: 0.05,
        transmission: 0.95,  
        ior: 1.5,        // Standard for glass
        envMapIntensity: 1.0,
        transparent: true,
        opacity: 1.0,    
        thickness: 5.0,  
        clearcoat: 1.0,  // Adds a glossy layer
        clearcoatRoughness: 0.1,
      });
    }
  });
  // Beer parameters (adjusted for visibility and fill level)
  const beerHeight = 25; // Increased height
  const beerGeometry = new THREE.CylinderGeometry(9, 9, beerHeight, 20);
  const beerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xebc100,
    transmission: 0.2,      // Less transmission = more opaque
    roughness: 0.3,         // Slightly rougher for frothiness
    metalness: 0.0,
    ior: 1.33,
    transparent: true,
    opacity: 0.9,           // Slightly more visible
    side: THREE.DoubleSide,
    thickness: 5.0,         // Match glass thickness
  });
  const beer = new THREE.Mesh(beerGeometry, beerMaterial);
  beer.position.y = beerHeight / 2 - 10; // Center in glass
  object.add(beer);

  // Foam adjustment
  const foamGeometry = new THREE.CylinderGeometry(8.0, 8.0, 1, 32);
  const foamMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfff5e1,
    roughness: 0.7,         // Rougher for foam texture
    transmission: 0.0,      
    opacity: 1.0,
    side: THREE.DoubleSide,
  });
  const foam = new THREE.Mesh(foamGeometry, foamMaterial);
  foam.position.y = beerHeight - 10; // Position at top of beer
  foam.name = "foam"
  object.add(foam);
  return object;
}