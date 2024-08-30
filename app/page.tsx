"use client";

import { useEffect, useState } from "react";
import { LYRICS } from "./_data/ lyrics";
import BlurIn from "@/components/magicui/blur-in";
import GradientCanvas from "./_components/GradientCanvas";
import CustomCursor from "./_components/CustomCursor";

export default function Home() {
  const lyrics = LYRICS.blue;
  const [lyricIndex, setLyricIndex] = useState(0);
  const [isPlayMusic, setPlayMusic] = useState(false);
  const [points, setPoints] = useState<any[]>([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const updateLyrics = () => {
      if (lyricIndex === lyrics.length - 1) {
        clearInterval(interval);
        return;
      }

      if (points.length > 0 && lyricIndex !== 3) {
        points.map((p) => {
          p.changeTargetColor();
        });
      }

      setLyricIndex((prev) => {
        return (prev + 1) % lyrics.length;
      });
    };
    const interval = setInterval(updateLyrics, lyrics[lyricIndex].duration);
    return () => clearInterval(interval);
  }, [lyricIndex, points, lyrics]);

  const startMusic = () => {
    const audio = new Audio("/audio/Blue.mp3");
    audio.play();
    audio.volume = 0.2;
    audio.addEventListener("play", () => {
      setPlayMusic(true);
    });
    audio.addEventListener("ended", () => {
      setPlayMusic(false);
      setIsClicked(false);
      setLyricIndex(0);
    });
  };

  const reset = () => {
    setLyricIndex(0);
    setPlayMusic(false);
  };

  return (
    <>
      <main
        className="flex min-h-screen flex-col items-center justify-center p-24"
        onClick={() => {
          if (isPlayMusic) return;

          reset();
          setIsClicked(true);
          !isPlayMusic && setTimeout(startMusic, 1000);
        }}
      >
        {isPlayMusic && (
          <div className="lyric-container">
            {lyrics[lyricIndex].lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="flex gap-3 md:gap-6 justify-center"
              >
                {line.map((wordObj, wordIndex) => (
                  <BlurIn
                    key={`${lyricIndex}-${lineIndex}-${wordIndex}`}
                    delay={wordObj.delay}
                    duration={wordObj.duration}
                    className="lyric"
                    word={wordObj.word}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {!isClicked && (
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              Did you know?
            </h1>
          </div>
        )}

        <button
          className="fixed bottom-0 right-0 p-4 m-4 bg-blue-500 text-white rounded-lg hidden"
          onClick={() => {
            points.length > 0 &&
              points.map((p) => {
                p.changeTargetColor();
              });
          }}
        >
          Next
        </button>
      </main>
      {isClicked && <GradientCanvas setPoints={setPoints} />}

      {!isClicked && <CustomCursor />}
    </>
  );
}
