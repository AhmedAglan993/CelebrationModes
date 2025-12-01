import React, { useState, useCallback } from "react";
import { Occasion, CelebrationData, Theme, ThemeId } from "../types";
import { generateCelebrationMessage } from "../services/geminiService";

interface InputScreenProps {
  onSubmit: (data: CelebrationData) => void;
}

const THEMES: Theme[] = [
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    previewUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop',
    overlayColor: 'bg-background-dark/90'
  },
  {
    id: 'golden-lights',
    name: 'Golden Lights',
    previewUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/60'
  },
  {
    id: 'colorful-balloons',
    name: 'Balloons',
    previewUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/40'
  },
  {
    id: 'pink-flowers',
    name: 'Floral',
    previewUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/50'
  },
  {
    id: 'neon-party',
    name: 'Neon Party',
    previewUrl: 'https://images.unsplash.com/photo-1495058489687-00439542a781?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1495058489687-00439542a781?q=80&w=2670&auto=format&fit=crop',
    overlayColor: 'bg-indigo-950/80'
  }
];

const InputScreen: React.FC<InputScreenProps> = ({ onSubmit }) => {
  const [guestName, setGuestName] = useState("");
  const [occasion, setOccasion] = useState<Occasion>(Occasion.Birthday);
  const [themeId, setThemeId] = useState<ThemeId>('golden-lights');
  const [message, setMessage] = useState("Wishing you a very happy birthday filled with joy, laughter, and unforgettable moments. May this year bring you all the success and happiness you deserve.");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = useCallback(async () => {
    if (!guestName) return; 
    
    setIsGenerating(true);
    try {
      const newMessage = await generateCelebrationMessage(guestName, occasion);
      setMessage(newMessage);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGenerating(false);
    }
  }, [guestName, occasion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim() && message.trim()) {
      onSubmit({ guestName, occasion, message, themeId });
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-white">
      {/* Staff App Header */}
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 z-20 bg-background-dark border-b border-white/5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">edit_note</span>
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">Staff Dashboard</h1>
            <p className="text-white/60 text-xs font-medium">Create a new celebration message</p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto w-full">
        <form className="flex flex-col gap-y-8 max-w-4xl mx-auto px-6 py-8" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white/80 uppercase tracking-wider text-sm font-bold border-b border-white/10 pb-2 mb-2">Guest Details</h3>
              
              {/* Guest Name */}
              <label className="flex flex-col w-full group">
                <p className="text-white/80 text-sm font-medium leading-normal pb-2 group-focus-within:text-primary transition-colors">
                  Guest Name
                </p>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="flex w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-white/10 bg-input-bg h-14 placeholder:text-white/30 p-4 text-base font-normal shadow-sm transition-all"
                  placeholder="E.g. Sarah Connor"
                  required
                />
              </label>

              {/* Occasion */}
              <label className="flex flex-col w-full group">
                <p className="text-white/80 text-sm font-medium leading-normal pb-2 group-focus-within:text-primary transition-colors">
                  Occasion
                </p>
                <div className="relative">
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as Occasion)}
                    className="flex w-full appearance-none rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-white/10 bg-input-bg h-14 p-4 pr-10 text-base font-normal shadow-sm cursor-pointer transition-all"
                  >
                    {Object.values(Occasion).map((occ) => (
                      <option key={occ} value={occ} className="bg-background-dark text-white">
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              
               {/* AI Generated Message */}
              <label className="flex flex-col w-full flex-1">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-white/80 text-sm font-medium leading-normal">
                    Message
                  </p>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isGenerating || !guestName}
                    className={`flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider transition-all rounded-md px-2 py-1 hover:bg-primary/10 ${
                      isGenerating || !guestName ? "opacity-50 cursor-not-allowed" : "hover:opacity-100"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
                      autorenew
                    </span>
                    {isGenerating ? "Writing..." : "Auto-Generate"}
                  </button>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex w-full flex-1 min-h-[140px] resize-none rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-white/10 bg-input-bg p-4 text-base font-normal leading-relaxed shadow-sm placeholder:text-white/30"
                  placeholder="Enter a custom message or generate one..."
                />
              </label>
            </div>

            {/* Right Column: Theme Selection */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white/80 uppercase tracking-wider text-sm font-bold border-b border-white/10 pb-2 mb-2">Display Theme</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                      themeId === theme.id 
                        ? "border-primary shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-[1.02]" 
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                  >
                    <img 
                      src={theme.previewUrl} 
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className={`font-bold text-sm text-white drop-shadow-md ${themeId === theme.id ? 'text-primary' : ''}`}>
                        {theme.name}
                      </span>
                    </div>
                    {themeId === theme.id && (
                      <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-0.5">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6">
                 <button
                  onClick={handleSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl h-16 bg-gradient-to-r from-primary to-[#00b8cc] text-background-dark text-lg font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0"
                >
                  <span className="material-symbols-outlined">cast</span>
                  Update Display
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default InputScreen;
