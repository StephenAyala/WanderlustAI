"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { createNoise3D } from "@/third-party/simplex-noise/simplex-noise";

interface WavyBackgroundProps {
  backgroundFill?: string;
  blur?: number;
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
  containerClassName?: string;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveWidth?: number;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}: WavyBackgroundProps) => {
  const noise = createNoise3D();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
  };

  const drawWave = (ctx: CanvasRenderingContext2D, nt: number) => {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth;
      ctx.strokeStyle = colors[i % colors.length];

      for (let x = 0; x < ctx.canvas.width; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + ctx.canvas.height * 0.5);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;

  const render = (ctx: CanvasRenderingContext2D, nt: number) => {
    ctx.fillStyle = backgroundFill;
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawWave(ctx, nt);
    animationId = requestAnimationFrame(() =>
      render(ctx, nt + (speed === "slow" ? 0.001 : 0.002))
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas(ctx);
    let nt = 0;

    const handleResize = () => resizeCanvas(ctx);
    window.addEventListener("resize", handleResize);

    render(ctx, nt);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [blur, speed, waveOpacity, colors, waveWidth]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
