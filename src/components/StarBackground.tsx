'use client'

import React, { useEffect, useRef } from "react";

const NUM_STARS = 1900;

type Star = {
  x: number;
  y: number;
  z: number;
  o: string;
};

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let focalLength = width * 2;
    let centerX = width / 2;
    let centerY = height / 2;
    //let radius = '0.' + Math.floor(Math.random() * 9 + 1);
    let stars: Star[] = [];
    let animate = true;

    const initializeStars = () => {
      stars = [];
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * width,
          o: '0.' + Math.floor(Math.random() * 99 + 1),
        });
      }
    };

    const moveStars = () => {
      for (let i = 0; i < NUM_STARS; i++) {
        const star = stars[i];
        star.z -= 3;
        if (star.z <= 0) {
          star.z = width;
        }
      }
    };

    const drawStars = () => {
      if (
        canvas.width !== window.innerWidth ||
        canvas.height !== window.innerHeight
      ) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        focalLength = width * 2;
        centerX = width / 2;
        centerY = height / 2;
        initializeStars();
      }
      ctx.fillStyle = "rgba(0,10,20,1)";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < NUM_STARS; i++) {
        const star = stars[i];
        const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX;
        const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY;
        const pixelRadius = 1 * (focalLength / star.z);
        ctx.fillStyle = `rgba(209, 255, 255, ${star.o})`;
        ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
      }
    };

    const animateFrame = () => {
      if (!animate) return;
      moveStars();
      drawStars();
      requestAnimationFrame(animateFrame);
    };

    initializeStars();
    animateFrame();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      focalLength = width * 2;
      centerX = width / 2;
      centerY = height / 2;
      initializeStars();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      animate = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default StarBackground;
