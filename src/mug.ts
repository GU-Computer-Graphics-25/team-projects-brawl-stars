import * as THREE from "three";

export default function createMug() {
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
  return object;
}