import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

// Define types
export interface Point {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: RGB;
  targetColor: RGB;
  colorChangeSpeed: number;
  move: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  transitionColor: () => void;
  changeTargetColor: () => void;
}
interface RGB {
  r: number;
  g: number;
  b: number;
}

export default function GradientCanvas({
  setPoints,
}: {
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();

  const generateDarkColor = useCallback((): RGB => {
    const generateRange = (min: number, max: number) =>
      Math.floor(min + Math.random() * (max - min));

    const colorTypes = [
      () => ({
        r: generateRange(30, 204),
        g: generateRange(30, 204),
        b: generateRange(50, 230),
      }),
      () => ({
        r: generateRange(50, 230),
        g: generateRange(30, 204),
        b: generateRange(30, 204),
      }),
      () => ({
        r: generateRange(40, 215),
        g: generateRange(25, 180),
        b: generateRange(50, 230),
      }),
      () => ({
        r: generateRange(25, 180),
        g: generateRange(40, 215),
        b: generateRange(50, 230),
      }),
    ];

    return colorTypes[Math.floor(Math.random() * colorTypes.length)]();
  }, []);

  const createPoint = useCallback((canvas: HTMLCanvasElement): Point => {
    const point = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: generateDarkColor(),
      targetColor: generateDarkColor(),
      colorChangeSpeed: 0.01,

      move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
      },

      draw(ctx: CanvasRenderingContext2D) {
        this.transitionColor();
        const isMobile = window.innerWidth < 768;

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          isMobile ? canvas.width * 1.2 : canvas.width / 2
        );

        const colorString = `rgb(${Math.round(this.color.r)}, ${Math.round(
          this.color.g
        )}, ${Math.round(this.color.b)})`;
        gradient.addColorStop(0, colorString);
        gradient.addColorStop(1, "transparent");

        ctx.filter = "blur(30px)";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
      },

      transitionColor() {
        this.color.r +=
          (this.targetColor.r - this.color.r) * this.colorChangeSpeed;
        this.color.g +=
          (this.targetColor.g - this.color.g) * this.colorChangeSpeed;
        this.color.b +=
          (this.targetColor.b - this.color.b) * this.colorChangeSpeed;
      },

      changeTargetColor() {
        this.targetColor = generateDarkColor();
      },
    };

    return point;
  }, []);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Remove the colors array since we're now generating colors dynamically
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let points = [] as Point[];
    const pointCount = 5;

    for (let i = 0; i < pointCount; i++) {
      points.push(createPoint(canvas));
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((point) => {
        point.move();
        point.draw(ctx);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    const interval = setInterval(() => {
      points.forEach((point) => point.changeTargetColor());
    }, 10000);

    setPoints(points);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setPoints([]);
    };
  }, [canvasRef, setPoints]);

  return (
    <>
      <motion.canvas
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.8 } }}
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: "0",
          zIndex: "-1",
          pointerEvents: "none",
          filter: "blur(30px)",
          display: "block",
        }}
      ></motion.canvas>
    </>
  );
}
