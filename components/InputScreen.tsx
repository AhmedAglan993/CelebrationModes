import React, { useState, useCallback, useEffect } from "react";
import { Occasion, CelebrationData, ThemeId, Theme } from "../types";
import { generateCelebrationMessage } from "../services/geminiService";

interface InputScreenProps {
  onSubmit: (data: CelebrationData) => void;
  onReset: () => void;
  onRefreshThemes: () => Promise<void>;
  themes: Theme[];
}

const InputScreen: React.FC<InputScreenProps> = ({ onSubmit, onReset, onRefreshThemes, themes }) => {
  const [guestName, setGuestName] = useState("");
  const [occasion, setOccasion] = useState<Occasion>(Occasion.Birthday);
  const [themeId, setThemeId] = useState<ThemeId>("");
  const [message, setMessage] = useState("Wishing you a very happy birthday filled with joy, laughter, and unforgettable moments. May this year bring you all the success and happiness you deserve.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshingThemes, setIsRefreshingThemes] = useState(false);

  // Set default theme when themes load
  useEffect(() => {
    if (themes.length > 0 && !themeId) {
      setThemeId(themes[0].id);
    }
  }, [themes, themeId]);

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

  const handleRefreshThemes = async () => {
    setIsRefreshingThemes(true);
    await onRefreshThemes();
    setTimeout(() => setIsRefreshingThemes(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim() && message.trim() && themeId) {
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
        
        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors border border-red-500/20"
        >
          <span className="material-symbols-outlined text-lg">restart_alt</span>
          <span className="hidden sm:inline">Reset Display</span>
        </button>
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
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <h3 className="text-white/80 uppercase tracking-wider text-sm font-bold">Display Theme</h3>
                <button 
                  type="button" 
                  onClick={handleRefreshThemes}
                  className="text-primary text-xs flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span className={`material-symbols-outlined text-sm ${isRefreshingThemes ? 'animate-spin' : ''}`}>sync</span>
                  Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
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
                      src={theme.previewUrl || theme.bgUrl} 
                      alt={theme.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Missing+Img';
                      }}
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