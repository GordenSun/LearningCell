import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { cloneScene } from '../lib/modelLoader';

interface Props {
  gltf: GLTF;
  autoRotate: boolean;
}

/**
 * 将 GLTF.scene 居中、缩放到合适大小后渲染。
 * 通过 useFrame 实现可控的自动旋转（OrbitControls 也有 autoRotate，
 * 这里再次实现一层是为了便于按需开启/暂停）。
 */
export function ModelScene({ gltf, autoRotate }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const { centeredScene, scale } = useMemo(() => {
    const cloned = cloneScene(gltf);

    // 先确定包围盒，将内容平移到原点
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // 将场景的位置反向平移，使内容居中
    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.4;
    return {
      centeredScene: cloned,
      scale: targetSize / maxDim,
    };
  }, [gltf]);

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.position.set(3.0, 1.6, 3.6);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, gltf]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={centeredScene} />
    </group>
  );
}
