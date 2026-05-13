import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { cloneScene } from '../lib/modelLoader';

interface Props {
  gltf: GLTF;
  autoRotate: boolean;
  /** 初始绕 Y 轴的旋转角度（弧度），默认 0（完全正面） */
  initialRotationY?: number;
  /** 在标准化基础上的额外缩放倍率，用于让不同模型默认大小不同 */
  displayScale?: number;
}

/**
 * 将 GLTF.scene 居中、缩放到合适大小后渲染。
 * 通过 useFrame 实现可控的自动旋转。
 */
export function ModelScene({
  gltf,
  autoRotate,
  initialRotationY = 0,
  displayScale = 1,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const { centeredScene, scale } = useMemo(() => {
    const cloned = cloneScene(gltf);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.0;
    return {
      centeredScene: cloned,
      scale: (targetSize / maxDim) * displayScale,
    };
  }, [gltf, displayScale]);

  // 切换模型时重置旋转到默认角度
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(0, initialRotationY, 0);
    }
  }, [initialRotationY, gltf]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={[0, initialRotationY, 0]}>
      <primitive object={centeredScene} />
    </group>
  );
}
