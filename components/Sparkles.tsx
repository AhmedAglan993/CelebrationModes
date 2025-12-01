import React from "react";

const Sparkles: React.FC = () => {
  // Config for random positioning and delays to match the "feel" of the provided CSS
  const sparkles = [
    { top: "15%", left: "20%", delay: "0s", color: "bg-primary" },
    { top: "30%", left: "80%", delay: "0.5s", color: "bg-white" },
    { top: "85%", left: "10%", delay: "1s", color: "bg-yellow-400" }, // Gold ish
    { top: "50%", left: "50%", delay: "1.5s", color: "bg-primary" },
    { top: "10%", left: "90%", delay: "2s", color: "bg-white" },
    { top: "60%", left: "5%", delay: "2.5s", color: "bg-yellow-400" },
    { top: "95%", left: "70%", delay: "0.2s", color: "bg-primary" },
    { top: "5%", left: "40%", delay: "0.8s", color: "bg-white" },
    { top: "70%", left: "95%", delay: "1.2s", color: "bg-yellow-400" },
    { top: "40%", left: "30%", delay: "1.8s", color: "bg-primary" },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {sparkles.map((s, i) => (
        <div
          key={i}
          className={`absolute w-[3px] h-[3px] rounded-full opacity-0 animate-sparkle ${s.color}`}
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.color.includes("white") ? "4s" : s.color.includes("yellow") ? "3.5s" : "3s",
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
