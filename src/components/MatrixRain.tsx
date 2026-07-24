import React, { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  opacity?: number;
  fps?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  opacity = 0.12, 
  fps = 8 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage or prefers-reduced-motion
    const savedState = localStorage.getItem('lureguard_matrix_enabled');
    if (savedState !== null) {
      setIsRunning(savedState === 'true');
    } else {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) setIsRunning(false);
    }

    // Listen for custom toggle events
    const handleToggle = (e: CustomEvent<{ enabled?: boolean }>) => {
      setIsRunning((prev) => {
        const nextState = e.detail?.enabled !== undefined ? e.detail.enabled : !prev;
        localStorage.setItem('lureguard_matrix_enabled', String(nextState));
        return nextState;
      });
    };

    window.addEventListener('lureguard-toggle-matrix' as any, handleToggle);
    return () => {
      window.removeEventListener('lureguard-toggle-matrix' as any, handleToggle);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const frameInterval = 1000 / fps;

    // Characters: Binary + Hexadecimal
    const characters = '01010101010101ABCDEF0123456789';
    const fontSize = 16;

    let columns = 0;
    let drops: number[] = [];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    };

    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    // If animation is disabled, clear canvas or draw single subtle static frame
    if (!isRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;

      lastFrameTime = currentTime - (elapsed % frameInterval);

      // Semi-transparent fade effect for trail
      ctx.fillStyle = 'rgba(8, 11, 16, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#34d399'; // Emerald Neon
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Alternate glowing head character vs subtle stream
        if (Math.random() > 0.92) {
          ctx.fillStyle = '#22d3ee'; // Cyan glow head
        } else {
          ctx.fillStyle = '#34d399';
        }

        ctx.fillText(text, x, y);

        // Reset drop when off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRunning, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: isRunning ? opacity : 0 }}
      aria-hidden="true"
    />
  );
};
