"use client";

import { useState, useEffect } from "react";

interface Banana {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  rotation: number;
}

export default function BananaEasterEgg() {
  const [bananas, setBananas] = useState<Banana[]>([]);
  const [clicked, setClicked] = useState(false);

  function triggerBananas() {
    if (clicked) return;
    setClicked(true);

    const newBananas: Banana[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 1.5,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 720 - 360,
    }));

    setBananas(newBananas);
    setTimeout(() => {
      setBananas([]);
      setClicked(false);
    }, 4000);
  }

  return (
    <>
      {/* Hidden banana trigger */}
      <button
        onClick={triggerBananas}
        title="🍌"
        className="text-base opacity-20 hover:opacity-100 transition-opacity duration-300 cursor-pointer select-none"
      >
        🍌
      </button>

      {/* Falling bananas */}
      {bananas.map((banana) => (
        <span
          key={banana.id}
          className="fixed top-0 pointer-events-none z-50 select-none"
          style={{
            left: `${banana.x}vw`,
            fontSize: `${banana.size}px`,
            animation: `bananaFall ${banana.duration}s ${banana.delay}s ease-in forwards`,
          }}
        >
          🍌
        </span>
      ))}

      <style jsx global>{`
        @keyframes bananaFall {
          0% {
            transform: translateY(-60px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(${Math.random() * 720}deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}
