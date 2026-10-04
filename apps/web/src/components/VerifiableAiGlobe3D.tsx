"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VerifiableAiGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.clientWidth || 240, container.clientHeight || 240);
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Core: Inner Golden/Terracotta Glowing Neural Core
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xE05338,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner dense wireframe
    const innerGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xE5A638,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerMesh);

    // Glowing point light at center
    const pointLight = new THREE.PointLight(0xE5A638, 3, 50);
    scene.add(pointLight);

    // 2. Cryptographic Gyroscope / Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(6.8, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xE05338,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(7.6, 0.06, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xE5A638,
      transparent: true,
      opacity: 0.85,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    masterGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(8.4, 0.05, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.45,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 6;
    masterGroup.add(ring3);

    // 3. Floating Neural Node Vertices
    const nodeCount = 48;
    const nodeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const nodeMaterialTerracotta = new THREE.MeshBasicMaterial({ color: 0xE05338 });
    const nodeMaterialGold = new THREE.MeshBasicMaterial({ color: 0xF4CF42 });
    const nodeMaterialCyan = new THREE.MeshBasicMaterial({ color: 0x34D399 });

    const nodesGroup = new THREE.Group();
    masterGroup.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio angle

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const r = 4.3 + Math.random() * 0.4;
      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;

      const mat = i % 3 === 0 ? nodeMaterialGold : i % 3 === 1 ? nodeMaterialTerracotta : nodeMaterialCyan;
      const node = new THREE.Mesh(nodeGeometry, mat);
      node.position.set(x, y * r, z);
      nodesGroup.add(node);
      nodeMeshes.push(node);
    }

    // 4. Data Particle Swarm (Federated Gradient Updates)
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xE05338);
    const c2 = new THREE.Color(0xE5A638);
    const c3 = new THREE.Color(0x38BDF8);

    for (let i = 0; i < particleCount; i++) {
      const dist = 5.5 + Math.random() * 4.5;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      positions[i * 3] = dist * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = dist * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = dist * Math.cos(phi);

      const colorPick = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      colors[i * 3] = colorPick.r;
      colors[i * 3 + 1] = colorPick.g;
      colors[i * 3 + 2] = colorPick.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particles);

    // 5. Mouse Interaction & Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    container.addEventListener("mousemove", onMouseMove);

    // 6. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      masterGroup.rotation.y += 0.008;
      masterGroup.rotation.x = mouseY * 0.8;
      masterGroup.rotation.z = mouseX * 0.8;

      // Independent ring rotations
      ring1.rotation.x += 0.012;
      ring1.rotation.y += 0.015;
      ring2.rotation.y -= 0.018;
      ring2.rotation.z += 0.010;
      ring3.rotation.z += 0.022;

      // Core pulsing
      const scale = 1 + Math.sin(time * 3) * 0.04;
      coreMesh.scale.set(scale, scale, scale);

      // Node subtle breathing
      nodeMeshes.forEach((mesh, idx) => {
        const nodePulse = Math.sin(time * 4 + idx * 0.5) * 0.15;
        mesh.scale.set(1 + nodePulse, 1 + nodePulse, 1 + nodePulse);
      });

      // Swarm particles slow drift
      particles.rotation.y -= 0.004;
      particles.rotation.x += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newSize = Math.min(container.clientWidth || 240, container.clientHeight || 240);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleClick = () => {
    setPulseCount((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full relative flex items-center justify-center cursor-pointer select-none"
      title="Interactive 3D Verifiable Neural Core (Move mouse to rotate, click to pulse)"
    />
  );
}
