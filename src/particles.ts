import * as THREE from "three";

export function createFoamParticles() {
  const particles = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xfff5e1 });
  
  for (let i = 0; i < 50; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
      (Math.random() - 0.5) * 16,
      Math.random() * 2,
      (Math.random() - 0.5) * 16
    );
    particles.add(particle);
  }
  
  return particles;
}

export function createSplashParticles() {
  const particles = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.3, 8, 8);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xebc100,
    transparent: true,
    opacity: 0.8
  });
  
  for (let i = 0; i < 30; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 2,
        (Math.random() - 0.5) * 3
      ),
      lifetime: 0
    };
    particles.add(particle);
  }
  
  return particles;
}

export function updateSplashParticles(particles: THREE.Group, delta: number) {
    particles.children.forEach((object: THREE.Object3D) => {
      const particle = object as THREE.Mesh;
      if (particle.userData?.lifetime < 1) {
        particle.position.addScaledVector(particle.userData.velocity, delta);
        particle.userData.velocity.y -= 9.8 * delta; // Gravity
        particle.userData.lifetime += delta * 0.5;
        if (particle.material instanceof THREE.MeshBasicMaterial) {
          particle.material.opacity = 1 - particle.userData.lifetime;
        }
      }
    });
  }
  