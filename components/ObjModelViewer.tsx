'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const glbCache = new Map<string, THREE.Group>();

interface ObjModelViewerProps {
  modelUrl: string;
  className?: string;
}

export default function ObjModelViewer({
  modelUrl,
  className = 'w-80 h-80 md:w-96 md:h-96',
}: ObjModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(!glbCache.has(modelUrl));

  const targetRotationY = useRef(0.4);
  const targetRotationX = useRef(0.16);
  const isInteracting = useRef(false);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    camera.position.set(0, 0.1, 4.75);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminación de estudio 3D
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.15);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bottomFill = new THREE.DirectionalLight(0xffffff, 0.65);
    bottomFill.position.set(0, -5, 2);
    scene.add(bottomFill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const setupModel = (rawScene: THREE.Group) => {
      const obj = rawScene.clone();
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      // Escala calculada con margen de seguridad para que nunca se recorte al girar 360°
      const scale = 1.68 / maxDim;

      obj.position.sub(center.multiplyScalar(scale));
      obj.scale.setScalar(scale);
      pivot.add(obj);
      setLoading(false);
    };

    if (glbCache.has(modelUrl)) {
      setupModel(glbCache.get(modelUrl)!);
    } else {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        encodeURI(modelUrl),
        (gltf) => {
          glbCache.set(modelUrl, gltf.scene);
          setupModel(gltf.scene);
        },
        undefined,
        (err) => {
          console.error('Error cargando modelo GLB:', modelUrl, err);
          setLoading(false);
        }
      );
    }

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isInteracting.current = true;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetRotationY.current += delta * 0.008;

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isInteracting.current = false;
      }, 1500);
    };

    container.addEventListener('wheel', onNativeWheel, { passive: false });

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isInteracting.current && !isDragging.current) {
        targetRotationY.current += 0.005;
      }

      pivot.rotation.y += (targetRotationY.current - pivot.rotation.y) * 0.12;
      pivot.rotation.x += (targetRotationX.current - pivot.rotation.x) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 360;
      const newH = container.clientHeight || 360;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('wheel', onNativeWheel);
      window.removeEventListener('resize', handleResize);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      renderer.dispose();
    };
  }, [modelUrl]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    targetRotationY.current += dx * 0.012;
    targetRotationX.current = Math.max(-0.6, Math.min(0.8, targetRotationX.current + dy * 0.01));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onClick={(e) => {
        if (isDragging.current) e.stopPropagation();
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`${className} cursor-grab active:cursor-grabbing drop-shadow-[0_28px_24px_rgba(0,0,0,0.45)]`}
        title="Usa el scroll encima o arrastra para girar el modelo 3D"
      />
    </div>
  );
}