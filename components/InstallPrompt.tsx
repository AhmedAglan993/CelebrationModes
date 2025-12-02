import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show our custom install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to install prompt: ${outcome}`);

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember dismissal for this session
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    // Don't show if dismissed in this session
    if (sessionStorage.getItem('installPromptDismissed')) {
        return null;
    }

    if (!showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">install_mobile</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm mb-1">Install Celebration Board</h3>
                        <p className="text-white/60 text-xs mb-3">
                            Install this app for quick access and offline use
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold text-xs py-2 px-3 rounded-lg transition-colors"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-white/40 hover:text-white/60 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
