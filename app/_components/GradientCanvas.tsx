import React, { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function GradientCanvas({
  setPoints,
}: {
  setPoints: React.Dispatch<React.SetStateAction<void>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = useMemo(() => {
    return [
      { r: 255, g: 0, b: 153 },
      { r: 73, g: 50, b: 64 },
      { r: 28, g: 28, b: 28 },
      { r: 224, g: 195, b: 252 },
      { r: 142, g: 197, b: 252 },
      { r: 5, g: 117, b: 230 },
      { r: 0, g: 0, b: 70 },
      { r: 0, g: 198, b: 255 },
      { r: 0, g: 255, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
    ];
  }, []);

  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let points = [] as Point[];
    const pointCount = 5;

    class Point {
      x: number;
      y: number;
      dx: number;
      dy: number;

      color: { r: number; g: number; b: number };
      targetColor: { r: number; g: number; b: number };
      colorChangeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 1.5;
        this.dy = (Math.random() - 0.5) * 1.5;
        this.color = this.randomColor();
        this.targetColor = this.randomColor();
        this.colorChangeSpeed = 0.01;
      }

      randomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
      }

      move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
      }

      draw() {
        this.transitionColor();

        const isMobile = window.innerWidth < 768;

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          isMobile ? canvas.width * 1.2 : canvas.width / 2,
        );
        const colorString = `rgb(${Math.round(this.color.r)}, ${Math.round(this.color.g)}, ${Math.round(this.color.b)})`;
        gradient.addColorStop(0, colorString);
        gradient.addColorStop(1, "transparent");

        ctx.filter = "blur(30px)";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
      }

      transitionColor() {
        this.color.r +=
          (this.targetColor.r - this.color.r) * this.colorChangeSpeed;
        this.color.g +=
          (this.targetColor.g - this.color.g) * this.colorChangeSpeed;
        this.color.b +=
          (this.targetColor.b - this.color.b) * this.colorChangeSpeed;
      }

      changeTargetColor() {
        this.targetColor = this.randomColor();
      }
    }

    for (let i = 0; i < pointCount; i++) {
      points.push(new Point());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((point) => {
        point.move();
        point.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    setInterval(() => {
      points.forEach((point) => point.changeTargetColor());
    }, 10000);

    setPoints(points);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef, colors, setPoints]);

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
