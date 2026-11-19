'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const cardGlbCache = new Map<string, THREE.Group>();

export default function ProductCard3D({ modelUrl }: { modelUrl: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 180;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-4, 2, -3);
    scene.add(fill);

    const renderStatic = (raw: THREE.Group) => {
      const obj = raw.clone();
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 1.95 / maxDim;

      obj.position.sub(center.multiplyScalar(scale));
      obj.scale.setScalar(scale);
      obj.rotation.set(0.22, 0.45, 0);
      scene.add(obj);
      renderer.render(scene, camera);
    };

    if (cardGlbCache.has(modelUrl)) {
      renderStatic(cardGlbCache.get(modelUrl)!);
    } else {
      const loader = new GLTFLoader();
      const draco = new DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(draco);

      loader.load(encodeURI(modelUrl), (gltf) => {
        cardGlbCache.set(modelUrl, gltf.scene);
        renderStatic(gltf.scene);
      });
    }

    return () => {
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={mountRef}
      className="w-44 h-44 flex items-center justify-center drop-shadow-[0_16px_18px_rgba(0,0,0,0.22)] pointer-events-none"
    />
  );
}