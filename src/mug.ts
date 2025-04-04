import * as THREE from "three";

export default function createMug() {
    const object = new THREE.Object3D();
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 30, 32, 1, true),
      new THREE.MeshPhysicalMaterial({
        roughness: 0.5,
        transmission: 0.8,
        thickness: 1,
        side: THREE.DoubleSide
      })
    );
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(10, 1, 12, 48, (Math.PI * 2) / 2),
      new THREE.MeshPhysicalMaterial({
        roughness: 0.5,
        transmission: 0.8,
        thickness: 1,
        side: THREE.DoubleSide,
      })
    );
    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(10),
      new THREE.MeshPhysicalMaterial({
        roughness: 0.5,
        transmission: 0.8,
        thickness: 1,
        side: THREE.DoubleSide
      })
    );
    handle.rotation.z = (3 * Math.PI) / 2;
    handle.position.x = 10;
    bottom.rotation.x = Math.PI / 2;
    bottom.position.y = -15;
    object.add(cylinder);
    object.add(bottom);
    object.add(handle);
    return object;
}