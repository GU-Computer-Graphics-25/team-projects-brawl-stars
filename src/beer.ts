import * as THREE from "three";

export default function createBeer() {
  const object = new THREE.Object3D();

  //Glass Material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.5,
    envMapIntensity: 1.0,
    transparent: true,
    thickness: 5.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
  });

  // Glass struct
  // Outer glass cylinder (main body)
  const outerGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 30, 32, 1, false), // <-- `openEnded: false` seals the bottom
    glassMaterial
  );

  // Inner glass cylinder (creates thickness)
  const innerGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(9.5, 9.5, 29, 32, 1, false), // Also sealed
    glassMaterial
  );
  innerGlass.position.y = 0.5; // Slight vertical offset

  // Handle 
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1, 12, 48, Math.PI),
    glassMaterial
  );
  handle.rotation.z = (3 * Math.PI) / 2;
  handle.position.x = 10;

  // Beer Liquid 
  const beerHeight = 25;
  const beerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xebc100,
    transmission: 0.2,
    roughness: 0.3,
    ior: 1.33,
    side: THREE.DoubleSide,
    thickness: 4.8,
    map: new THREE.TextureLoader().load("lager.jpg")
  });

  const beer = new THREE.Mesh(
    new THREE.CylinderGeometry(9.0, 9.0, beerHeight, 32),
    beerMaterial
  );
  beer.position.y = beerHeight / 2 - 10;

  // Foam
  const foam = new THREE.Mesh(
    new THREE.CylinderGeometry(8.5, 8.5, 1.5, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xfff5e1,
      roughness: 0.7,
      side: THREE.DoubleSide,
    })
  );
  foam.position.y = beerHeight - 9.5;
  foam.name = "foam";

  //  Assemble
  object.add(outerGlass, innerGlass, handle, beer, foam);
  return object;
}