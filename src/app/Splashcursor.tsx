"use client";
import React, { useEffect, useRef, memo } from "react";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: ColorRGB;
  TRANSPARENT?: boolean;
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: ColorRGB;
}

function pointerPrototype(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

// Using memo to prevent unnecessary re-renders
const SplashCursor = memo(function SplashCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create the canvas for the particle effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    document.body.appendChild(canvas);
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    // Mouse tracking variables
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let hue = 0;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];
    
    // Update mouse position on move
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Update canvas size on resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Animation loop with RAF
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add some particles even without mouse movement to make cursor visible initially
      if (particles.length < 10) {
        hue = (hue + 1) % 360;
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 8 + 2,
          color: `hsl(${hue}, 100%, 50%)`,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: Math.random() * 15 + 10
        });
      }
      
      // Create particles based on mouse movement
      const speed = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      
      if (speed > 3) {
        hue = (hue + 1) % 360;
        
        // Create particles when mouse is moving
        for (let i = 0; i < Math.min(3, speed / 10); i++) {
          particles.push({
            x: mouseX,
            y: mouseY,
            size: Math.random() * 8 + 2,
            color: `hsl(${hue}, 100%, 50%)`,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 0,
            maxLife: Math.random() * 15 + 10
          });
        }
      }
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.95;
        
        const opacity = 1 - p.life / p.maxLife;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw cursor
      ctx.globalAlpha = 1;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 15;
      ctx.fill();
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      
      // Continue animation loop
      requestAnimationFrame(animate);
    };
    
    // Add event listeners with passive option for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);
  
  return <div ref={cursorRef} />;
});

export default SplashCursor;
