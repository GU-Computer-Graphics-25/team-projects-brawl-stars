import * as THREE from "three";
import * as CANNON from 'cannon-es';
import { createFoamParticles, createSplashParticles } from './particles';

interface BeerObject {
  object: THREE.Group;
  physicsBody: CANNON.Body;
  beerMesh: THREE.Mesh;
  foamMesh: THREE.Mesh;
  splashParticles: THREE.Group;
}

export default function createBeer(scene: THREE.Scene, world: CANNON.World): BeerObject {
  const object = new THREE.Object3D();
  const beerGroup = new THREE.Group();
  
  // Glass Material
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

  // Glass structure
  const outerGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 30, 32, 1, false),
    glassMaterial
  );

  const innerGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(9.5, 9.5, 29, 32, 1, false),
    glassMaterial
  );
  innerGlass.position.y = 0.5;

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1, 12, 48, Math.PI),
    glassMaterial
  );
  handle.rotation.z = (3 * Math.PI) / 2;
  handle.position.x = 10;

  // Beer Liquid with physics
  const beerHeight = 25;
  const beerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xebc100,
    transmission: 0.2,
    roughness: 0.3,
    ior: 1.33,
    side: THREE.DoubleSide,
    thickness: 4.8,
  });

  const beer = new THREE.Mesh(
    new THREE.CylinderGeometry(9.0, 9.0, beerHeight, 32),
    beerMaterial
  );
  beer.position.y = beerHeight / 2 - 10;
  beer.name = "beerLiquid";

  // Physics body for the mug
  const mugShape = new CANNON.Cylinder(10, 10, 30, 32);
  const mugBody = new CANNON.Body({
    mass: 0.5,
    shape: mugShape,
    material: new CANNON.Material({ restitution: 0.3 }),
    position: new CANNON.Vec3(0, 0, 0)
  });
  mugBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(mugBody);

  // Foam with dynamic behavior
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

  // Foam particles
  const foamParticles = createFoamParticles();
  foam.add(foamParticles);

  // Splash particles (initially hidden)
  const splashParticles = createSplashParticles();
  splashParticles.visible = false;
  object.add(splashParticles);

  // Assemble
  object.add(outerGlass, innerGlass, handle, beer, foam);
  beerGroup.add(object);
  scene.add(beerGroup);

  return {
    object: beerGroup,
    physicsBody: mugBody,
    beerMesh: beer,
    foamMesh: foam,
    splashParticles
  };
}

export function updateBeer(beerObj: BeerObject, time: number, delta: number) {
  // Simulate fluid movement based on physics body velocity
  const velocity = beerObj.physicsBody.velocity.length();
  
  // Make foam react to movement (using delta for frame-rate independence)
  if (velocity > 0.1) {
    const waveIntensity = Math.min(velocity * 0.5, 1.5);
    const foamWave = Math.sin(time * 10) * waveIntensity * 0.1;
    const foamBob = Math.sin(time * 8) * waveIntensity * 0.2;
    
    beerObj.foamMesh.scale.y = 1 + foamWave * delta * 60; // Normalize to 60fps
    beerObj.foamMesh.position.y = (25 - 9.5) + foamBob * delta * 60;
    
    // Show splash particles when velocity is high
    if (velocity > 2 && !beerObj.splashParticles.visible) {
      beerObj.splashParticles.visible = true;
      beerObj.splashParticles.position.copy(beerObj.object.position);
      beerObj.splashParticles.position.y += 10;
      setTimeout(() => {
        beerObj.splashParticles.visible = false;
      }, 1000);
    }
  } else {
    beerObj.foamMesh.scale.y = 1;
  }
  
  syncPhysicsToGraphics(beerObj.object, beerObj.physicsBody);
}

// Helper function to sync physics and graphics
function syncPhysicsToGraphics(mesh: THREE.Object3D, body: CANNON.Body) {
  mesh.position.set(body.position.x, body.position.y, body.position.z);
  mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
}