"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function CustomCursor({ isClicked }: { isClicked: boolean }) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cursorRef.current) return;

    const cursor = cursorRef.current;
    cursor.style.opacity = "1";
    const x = e.clientX - cursor.clientWidth / 2;
    const y = e.clientY - cursor.clientHeight / 2;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const handleMouseDown = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseLeave]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 opacity-0 left-0 z-50 size-[150px] border border-white rounded-full pointer-events-none grid place-items-center transition-opacity",
        {
          hidden: isClicked,
        }
      )}
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
