"use client";

import { useEffect, useRef } from "react";

export default function RetroNeuralOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth * 2);
    let height = (canvas.height = canvas.offsetHeight * 2);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * 2;
      height = canvas.height = canvas.offsetHeight * 2;
    };
    window.addEventListener("resize", handleResize);

    const nodesCount = 18;
    const nodes: {
      angle: number;
      orbitRadius: number;
      speed: number;
      size: number;
      color: string;
      pulse: number;
    }[] = [];

    const colors = ["#E05338", "#E5A638", "#38BDF8", "#34D399", "#FAF5EE"];

    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        angle: (i / nodesCount) * Math.PI * 2,
        orbitRadius: 40 + Math.random() * 65,
        speed: (0.008 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
        size: 2.5 + Math.random() * 3,
        color: colors[i % colors.length],
        pulse: Math.random() * Math.PI,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = width / 240;

      // Outer delicate orbital rings
      [45, 75, 105].forEach((radius, idx) => {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius * scale,
          (radius * 0.55) * scale,
          (idx * 45 * Math.PI) / 180 + time * 0.1,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = idx === 1 ? "rgba(224, 83, 56, 0.4)" : "rgba(250, 245, 238, 0.15)";
        ctx.lineWidth = 1 * scale;
        ctx.setLineDash(idx === 2 ? [4, 6] : []);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Central core glowing model tensor
      const coreRadius = (16 + Math.sin(time * 2) * 2) * scale;
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2);
      coreGradient.addColorStop(0, "rgba(224, 83, 56, 0.95)");
      coreGradient.addColorStop(0.6, "rgba(229, 166, 56, 0.7)");
      coreGradient.addColorStop(1, "rgba(24, 26, 36, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "#FAF5EE";
      ctx.fill();

      // Draw connecting lines between nodes
      const currentPoints: { x: number; y: number; color: string }[] = [];
      nodes.forEach((node) => {
        node.angle += node.speed;
        const currentR = (node.orbitRadius + Math.sin(time + node.pulse) * 6) * scale;
        const x = centerX + Math.cos(node.angle) * currentR;
        const y = centerY + Math.sin(node.angle) * (currentR * 0.65);
        currentPoints.push({ x, y, color: node.color });
      });

      for (let i = 0; i < currentPoints.length; i++) {
        // Line to core
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
          ctx.strokeStyle = "rgba(224, 83, 56, 0.25)";
          ctx.lineWidth = 0.8 * scale;
          ctx.stroke();
        }

        // Line to nearest neighbors
        for (let j = i + 1; j < currentPoints.length; j++) {
          const dx = currentPoints[i].x - currentPoints[j].x;
          const dy = currentPoints[i].y - currentPoints[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 55 * scale) {
            ctx.beginPath();
            ctx.moveTo(currentPoints[i].x, currentPoints[i].y);
            ctx.lineTo(currentPoints[j].x, currentPoints[j].y);
            ctx.strokeStyle = `rgba(250, 245, 238, ${0.35 * (1 - dist / (55 * scale))})`;
            ctx.lineWidth = 0.7 * scale;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      currentPoints.forEach((pt, idx) => {
        const node = nodes[idx];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, node.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer transition-transform duration-500 hover:scale-105"
        title="Interactive Neural Constellation with zkML Prover Nodes"
      />
    </div>
  );
}
