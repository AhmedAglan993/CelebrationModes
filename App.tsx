import React, { useState, useEffect } from "react";
import InputScreen from "./components/InputScreen";
import DisplayScreen from "./components/DisplayScreen";
import { CelebrationData } from "./types";
import { updateCelebration, subscribeToCelebration } from "./services/firebase";

type AppMode = 'select' | 'staff' | 'display';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');
  const [data, setData] = useState<CelebrationData | null>(null);

  // 1. Check URL parameters on load to determine mode automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'staff') setMode('staff');
    if (modeParam === 'display') setMode('display');
  }, []);

  // 2. Subscribe to Firebase updates when in Display mode
  useEffect(() => {
    if (mode === 'display') {
      const unsubscribe = subscribeToCelebration((newData) => {
        if (newData) {
          setData(newData);
        }
      });
      return () => unsubscribe();
    }
  }, [mode]);

  const handleStaffSubmit = (newData: CelebrationData) => {
    // Send to Firebase (Realtime Database)
    updateCelebration(newData);
    alert("Sent to all connected screens!");
  };

  const setModeWithUrl = (newMode: AppMode) => {
    setMode(newMode);
    // Update URL without refreshing so user can copy/paste it to another device
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.pushState({}, '', url);
  };

  const handleBackToSelect = () => {
    setModeWithUrl('select');
    setData(null);
  };

  // Landing Screen for Role Selection
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 font-display">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Staff Option */}
          <button 
            onClick={() => setModeWithUrl('staff')}
            className="group relative h-80 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 p-8 flex flex-col items-center justify-center gap-6 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-2xl"
          >
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-white group-hover:text-primary">tablet_mac</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Staff Tablet</h2>
              <p className="text-white/50">Control the messages and themes displayed on the screens.</p>
            </div>
          </button>

          {/* Display Option */}
          <button 
            onClick={() => setModeWithUrl('display')}
            className="group relative h-80 rounded-2xl bg-gradient-to-br from-indigo-950 to-gray-900 border border-white/10 p-8 flex flex-col items-center justify-center gap-6 hover:border-indigo-400/50 transition-all hover:-translate-y-1 shadow-2xl"
          >
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-400/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-white group-hover:text-indigo-400">monitor</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Display Screen</h2>
              <p className="text-white/50">Set this device as a digital signage display to receive messages.</p>
            </div>
          </button>

        </div>
        
        <div className="absolute bottom-8 text-white/20 text-sm">
          Select a mode to generate a shareable URL.
        </div>
      </div>
    );
  }

  return (
    <>
      {mode === 'staff' ? (
        <div className="relative h-full">
           <InputScreen onSubmit={handleStaffSubmit} />
           <button 
             onClick={handleBackToSelect}
             className="fixed bottom-4 left-4 z-50 text-white/20 hover:text-white text-xs bg-black/50 px-2 py-1 rounded"
           >
             Exit
           </button>
        </div>
      ) : (
        <DisplayScreen data={data} onBack={handleBackToSelect} />
      )}
    </>
  );
};

export default App;
