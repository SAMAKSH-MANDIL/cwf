"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NetworkHologramProps {
  activeNodesCount?: number;
  isTraining?: boolean;
}

export default function NetworkHologram3D({
  activeNodesCount = 4,
  isTraining = false,
}: NetworkHologramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Central Model Core (Icosahedron + Wireframe)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing sphere
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Secondary purple lattice
    const outerGeo = new THREE.IcosahedronGeometry(5.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Center nucleus point light simulation
    const nucleusGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // 3. Orbiting Satellite Nodes (Representing Edge Devices / Hospitals)
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const orbitCount = Math.max(activeNodesCount, 3);
    const satellites: THREE.Mesh[] = [];
    const orbitRadius = 9.5;

    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      const satGeo = new THREE.OctahedronGeometry(1.1, 0);
      const satMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x10b981 : 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.x = Math.cos(angle) * orbitRadius;
      satMesh.position.y = Math.sin(angle) * (orbitRadius * 0.45);
      satMesh.position.z = Math.sin(angle) * 3;
      nodesGroup.add(satMesh);
      satellites.push(satMesh);
    }

    // 4. Floating Data Constellation Particles
    const particlesCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 30;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.22,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // 6. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speedMultiplier = isTraining ? 2.5 : 1.0;

      // Rotate central model core
      coreGroup.rotation.y += 0.008 * speedMultiplier;
      coreGroup.rotation.x += 0.004 * speedMultiplier;

      // Pulse nucleus
      const pulse = 1 + Math.sin(elapsed * 3) * 0.15;
      nucleusMesh.scale.set(pulse, pulse, pulse);

      // Rotate orbiting nodes
      nodesGroup.rotation.z += 0.006 * speedMultiplier;
      nodesGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.3;

      satellites.forEach((sat) => {
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Subtle parallax response to mouse
      scene.rotation.y += (mouseX * 0.3 - scene.rotation.y) * 0.05;
      scene.rotation.x += (-mouseY * 0.3 - scene.rotation.x) * 0.05;

      particleSystem.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeNodesCount, isTraining]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-3xl">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono">
        <span className={`w-2 h-2 rounded-full ${isTraining ? "bg-cyan-400 animate-ping" : "bg-emerald-400 animate-pulse"}`}></span>
        <span className="text-white font-bold">{isTraining ? "3D Hologram: Training Active" : "3D Mesh: Neural Constellation"}</span>
      </div>

      <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-slate-500">
        WebGL 3D Core • Drag to Rotate
      </div>
    </div>
  );
}
