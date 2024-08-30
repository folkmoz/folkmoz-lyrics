"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cursor = ref.current;
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.opacity = "1";
      const x = e.clientX - cursor.clientWidth / 2;
      const y = e.clientY - cursor.clientHeight / 2;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onMouseDown = (e: MouseEvent) => {
      cursor.style.opacity = "0";
    };

    const onMouseLeave = (e: MouseEvent) => {
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseout", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseout", onMouseLeave);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-50 size-[150px] border border-white rounded-full pointer-events-none opacity-0 grid place-items-center transition-opacity"
    >
      <div className="flex items-center ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-[30px]"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        play
      </div>
    </div>
  );
}
