import React, { useMemo } from "react";

export const CherryBlossoms: React.FC = () => {
  const petals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 8 + 8, // 8px to 16px
        delay: Math.random() * -15,   // Negative delay starts animation mid-cycle for immediate effect
        duration: Math.random() * 10 + 10, // 10s to 20s duration
        rotation: Math.random() * 360,
        drift: Math.random() * 120 - 60, // -60px to 60px drift
        rotationEnd: 360 + Math.random() * 360,
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute sakura-petal"
          style={{
            left: petal.left,
            top: "-5vh",
            width: `${petal.size}px`,
            height: `${petal.size * 0.85}px`,
            opacity: 0,
            animation: `sakura-fall ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            transform: `rotate(${petal.rotation}deg)`,
            // Injecting custom CSS variables for horizontal drift & rotation ending state
            "--drift-x": `${petal.drift}px`,
            "--rotation-end": `${petal.rotationEnd}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
