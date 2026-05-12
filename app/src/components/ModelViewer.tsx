import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { CellModel } from '../data/models';
import { useModel } from '../hooks/useModel';
import { ModelScene } from './ModelScene';
import { ProgressOverlay } from './ProgressOverlay';

interface Props {
  model: CellModel;
}

export function ModelViewer({ model }: Props) {
  const { status, progress, entry } = useModel(model.modelUrl, {
    autoStart: true,
    fileSize: model.fileSize,
  });
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const isReady = status === 'done' && !!entry?.gltf;

  const handleReset = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(0, 0, 0);
    controls.object.position.set(3, 1.6, 3.6);
    controls.update();
  };

  return (
    <div className="viewer">
      <div className="viewer-stage">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [3, 1.6, 3.6], fov: 45 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[5, 6, 4]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-3, 2, -4]} intensity={0.35} />

          <Suspense fallback={null}>
            <Environment preset="studio" environmentIntensity={0.55} />
          </Suspense>

          {isReady && entry?.gltf && (
            <ModelScene gltf={entry.gltf} autoRotate={false} />
          )}

          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.32}
            scale={6}
            blur={2.4}
            far={3.2}
          />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={1.5}
            maxDistance={9}
            autoRotate={autoRotate}
            autoRotateSpeed={0.7}
          />
        </Canvas>

        {!isReady && (
          <ProgressOverlay
            progress={progress}
            status={status}
            modelName={model.name}
            error={entry?.error}
          />
        )}

        <div className="viewer-hint">
          <span>拖拽旋转</span>
          <span>滚轮缩放</span>
          <span>右键平移</span>
        </div>
      </div>

      <div className="viewer-toolbar">
        <button
          type="button"
          className={`tool-btn${autoRotate ? ' active' : ''}`}
          onClick={() => setAutoRotate((v) => !v)}
        >
          <RotateIcon />
          {autoRotate ? '暂停旋转' : '自动旋转'}
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={handleReset}
        >
          <ResetIcon />
          复位视角
        </button>
      </div>
    </div>
  );
}

function RotateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 4 21 10 15 10" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 12 6 9 9 12" />
      <path d="M6 9v6a6 6 0 0 0 6 6h3" />
      <path d="M21 12l-3 3-3-3" />
      <path d="M18 15V9a6 6 0 0 0-6-6H9" />
    </svg>
  );
}
