import * as THREE from "three";

interface ParticleUserData {
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
  size?: number;
}

export function createFoamParticles(): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: 0xfff5e1,
    transparent: true,
    opacity: 0.8
  });

  for (let i = 0; i < 50; i++) {
    const size = 0.2 + Math.random() * 0.3;
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const particle = new THREE.Mesh(geometry, material.clone());
    particle.visible = false;
    group.add(particle);
  }

  return group;
}

export function createSplashParticles(): THREE.Group {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
      color: 0xebc100,
      transparent: true,
      opacity: 0.9
    });

  // Create more visible particles
  for (let i = 0; i < 150; i++) { // Increased from 100
    const size = 0.5 + Math.random() * 0.7; // Larger particles (0.5-1.2 units)
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const particle = new THREE.Mesh(geometry, material.clone());
    particle.visible = false;
    particle.castShadow = true;
    particle.receiveShadow = true;
    group.add(particle);
  }

  return group;
}

export function updateSplashParticles(particles: THREE.Group, delta: number) {
  particles.children.forEach(particle => {
    if (!particle.visible || !(particle instanceof THREE.Mesh)) return;

    const data = particle.userData as ParticleUserData;
    if (!data) return;

    data.lifetime += delta;

    // Apply gravity and movement
    data.velocity.y -= 9.8 * delta * 0.5; // Reduced gravity for particles
    particle.position.add(data.velocity.clone().multiplyScalar(delta));

    // Fade out particles
    if (particle.material instanceof THREE.MeshBasicMaterial) {
      particle.material.opacity = 1 - (data.lifetime / data.maxLifetime);
    }

    // Remove expired particles
    if (data.lifetime >= data.maxLifetime) {
      particle.visible = false;
    }
  });
}

export function triggerSplash(
    particles: THREE.Group,
    position: THREE.Vector3,
    intensity: number,
    direction?: THREE.Vector3
  ) {
  // Find available particles
  position.y += 12; // needs to be rim height
  // Determine how many particles to activate
  const particleCount = Math.min(
    Math.floor(50 * intensity), // Increased from 30
    particles.children.length
  );

  for (let i = 0; i < particleCount; i++) {
    const particle = particles.children[i] as THREE.Mesh;
    particle.position.copy(position);
    
    // Add random spread
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 3; // Wider spread
    particle.position.x += Math.cos(angle) * radius;
    particle.position.z += Math.sin(angle) * radius;
    particle.position.y += Math.random() * 2;

    // Set initial velocity with directional bias
    const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 15 * intensity, // Increased from 8
        Math.random() * 12 * intensity,         // Increased from 10
        (Math.random() - 0.5) * 15 * intensity
      );

      if (direction) {
        velocity.add(direction.clone().multiplyScalar(10 * intensity)); // Stronger direction
      }
  
      particle.userData = {
        velocity: velocity,
        lifetime: 0,
        maxLifetime: 1.0 + Math.random() // Longer lifetime
      };
  
      if (particle.material instanceof THREE.MeshBasicMaterial) {
        particle.material.opacity = 1;
        particle.material.needsUpdate = true;
      }
  
      particle.visible = true;
    }
  }