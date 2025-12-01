import React, { useEffect, useRef } from "react";
import { CelebrationData, Theme } from "../types";
import Sparkles from "./Sparkles";

// Extend window for canvas-confetti
declare global {
  interface Window {
    confetti: any;
  }
}

interface DisplayScreenProps {
  data: CelebrationData | null;
  onBack: () => void;
}

const THEMES: Record<string, Theme> = {
  'elegant-dark': {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    previewUrl: '',
    bgUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop',
    overlayColor: 'bg-background-dark/80' 
  },
  'golden-lights': {
    id: 'golden-lights',
    name: 'Golden Lights',
    previewUrl: '',
    bgUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/50'
  },
  'colorful-balloons': {
    id: 'colorful-balloons',
    name: 'Balloons',
    previewUrl: '',
    bgUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/40'
  },
  'pink-flowers': {
    id: 'pink-flowers',
    name: 'Floral',
    previewUrl: '',
    bgUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/40'
  },
  'neon-party': {
    id: 'neon-party',
    name: 'Neon Party',
    previewUrl: '',
    bgUrl: 'https://images.unsplash.com/photo-1495058489687-00439542a781?q=80&w=2670&auto=format&fit=crop',
    overlayColor: 'bg-indigo-950/70'
  }
};

const DisplayScreen: React.FC<DisplayScreenProps> = ({ data, onBack }) => {
  const currentTheme = data ? (THEMES[data.themeId] || THEMES['golden-lights']) : THEMES['golden-lights'];
  const initializedRef = useRef(false);

  // Confetti Effect
  useEffect(() => {
    if (data && window.confetti) {
      // Small reset to allow re-triggering if data changes
      initializedRef.current = true;
      
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        window.confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00e5ff', '#ffffff', '#fbbf24']
        });
        window.confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00e5ff', '#ffffff', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Big Burst
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      frame();
    }
  }, [data]); // Trigger when data changes

  // Standby Mode
  if (!data) {
    return (
      <div 
        className="relative flex h-screen w-full flex-col items-center justify-center bg-background-dark text-white overflow-hidden"
        onClick={onBack}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-zoom-slow"></div>
        <div className="relative z-10 text-center space-y-4 p-8">
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-white/90 drop-shadow-lg tracking-wider">
             Welcome
           </h1>
           <p className="text-lg text-white/60 font-display tracking-widest uppercase">
             Waiting for celebration...
           </p>
           <div className="pt-8">
             <div className="w-16 h-1 bg-primary/50 mx-auto rounded-full animate-pulse"></div>
           </div>
        </div>
        {/* Hidden back button area for demo purposes */}
        <div className="absolute top-0 left-0 p-4 opacity-0 hover:opacity-100 transition-opacity">
          <button className="bg-black/50 text-white px-3 py-1 text-xs rounded">Exit Display Mode</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex h-screen w-full flex-col items-center justify-center bg-background-dark text-white overflow-hidden animate-fade-in cursor-none select-none"
      onClick={onBack}
    >
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-slow z-0"
        style={{ backgroundImage: `url(${currentTheme.bgUrl})` }}
      />
      
      {/* Overlay for Readability */}
      <div className={`absolute inset-0 ${currentTheme.overlayColor} z-0 transition-colors duration-1000`} />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Sparkles />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-6xl px-8 space-y-12">
        
        {/* Occasion Label */}
        <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-50"></div>
           <p className="relative text-primary text-xl md:text-3xl font-serif italic tracking-wider leading-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Happy {data.occasion}
          </p>
        </div>

        {/* Message Body - Serif Font */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight tracking-tight drop-shadow-2xl">
            {data.message}
          </h1>
        </div>

        {/* Guest Name - Script Font */}
        <div className="relative pt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
           {/* Text Glow */}
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white bg-300% animate-shine text-7xl md:text-9xl lg:text-[10rem] font-script transform -rotate-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] p-4">
            {data.guestName}
          </h2>
        </div>
      </main>
      
      {/* Branding Footer */}
      <div className="absolute bottom-8 flex flex-col items-center opacity-60 z-10">
        <p className="text-white/80 text-xs font-serif italic tracking-widest">The Celebration Board</p>
      </div>
    </div>
  );
};

export default DisplayScreen;
