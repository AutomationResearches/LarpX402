import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  active: boolean;
}

interface Drop {
  y: number;
  speed: number;
  opacity: number;
  char: string;
  hue: number;
}

export default function MatrixRain({ active }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mystical character set - mix of katakana, symbols, and brand
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン⌘◊∆∇◈◉⬡⬢⟡✧✦⚝☆★0123456789LARPX402';
    const charArray = chars.split('');
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Initialize drops with varied properties
    const drops: Drop[] = Array(columns).fill(null).map(() => ({
      y: Math.random() * -100,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.7,
      char: charArray[Math.floor(Math.random() * charArray.length)],
      hue: Math.random() > 0.7 ? 280 + Math.random() * 40 : 140 + Math.random() * 40 // Purple or cyan-green
    }));

    let animationId: number;
    let time = 0;

    const draw = () => {
      if (!active) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // Deeper fade for mysterious trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        const y = drop.y * fontSize;

        // Change character occasionally
        if (Math.random() > 0.98) {
          drop.char = charArray[Math.floor(Math.random() * charArray.length)];
        }

        // Pulsing opacity based on time
        const pulseOpacity = drop.opacity * (0.7 + 0.3 * Math.sin(time * 2 + i * 0.1));

        // Leading character - bright white with glow
        if (Math.random() > 0.92) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `hsla(${drop.hue}, 100%, 70%, 0.8)`;
          ctx.fillStyle = `hsla(${drop.hue}, 100%, 95%, ${pulseOpacity})`;
        } else if (Math.random() > 0.7) {
          // Bright characters
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsla(${drop.hue}, 80%, 50%, 0.5)`;
          ctx.fillStyle = `hsla(${drop.hue}, 80%, 60%, ${pulseOpacity})`;
        } else {
          // Dimmer trail characters
          ctx.shadowBlur = 4;
          ctx.shadowColor = `hsla(${drop.hue}, 70%, 40%, 0.3)`;
          ctx.fillStyle = `hsla(${drop.hue}, 60%, 40%, ${pulseOpacity * 0.6})`;
        }

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(drop.char, x, y);

        // Reset shadow for performance
        ctx.shadowBlur = 0;

        // Move drop down
        drop.y += drop.speed;

        // Reset when off screen with random delay
        if (y > canvas.height && Math.random() > 0.99) {
          drop.y = Math.random() * -20;
          drop.speed = 0.5 + Math.random() * 1.5;
          drop.opacity = 0.3 + Math.random() * 0.7;
          drop.hue = Math.random() > 0.7 ? 280 + Math.random() * 40 : 140 + Math.random() * 40;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    if (active) {
      draw();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
