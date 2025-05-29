'use client';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

// Define the BeforeInstallPromptEvent interface since it's not in standard TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Define the Navigator extension for getInstalledRelatedApps
interface NavigatorWithInstalledApps extends Navigator {
  getInstalledRelatedApps?: () => Promise<InstalledRelatedApp[]>;
  standalone?: boolean;
}

// Define the InstalledRelatedApp interface
interface InstalledRelatedApp {
  id: string;
  platform: string;
  url?: string;
  version?: string;
}

interface PWAInstallerProps {
  mounted: boolean;
}

export default function PWAInstaller({ mounted }: PWAInstallerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [iOSInstructionsVisible, setIOSInstructionsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!mounted) return;

    // Check if user is on iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    setIsIOS(checkIOS());

    // More reliable app installation detection
    const checkAppInstalled = () => {
      // Method 1: Check if in standalone mode or display-mode is standalone
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as NavigatorWithInstalledApps).standalone === true
      ) {
        setIsAppInstalled(true);
        return true;
      }

      // Method 2: Use the new getInstalledRelatedApps API (if available)
      const navigatorExt = navigator as NavigatorWithInstalledApps;
      if (navigatorExt.getInstalledRelatedApps) {
        navigatorExt
          .getInstalledRelatedApps()
          .then((apps: InstalledRelatedApp[]) => {
            if (apps.length > 0) {
              setIsAppInstalled(true);
              return true;
            }
            return false;
          })
          .catch(() => false);
      }
      return false;
    };

    checkAppInstalled();

    // Event handlers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
      }
    };

    // Media query to detect changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", handleDisplayModeChange);

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, [mounted]);

  // Re-check installation status when the component becomes visible
  useEffect(() => {
    if (!mounted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if the app is in standalone mode
        if (
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as NavigatorWithInstalledApps).standalone === true
        ) {
          setIsAppInstalled(true);
          setDeferredPrompt(null);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mounted]);

  // Handle PWA installation for non-iOS devices
  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS installation instructions
      setIOSInstructionsVisible(!iOSInstructionsVisible);
      return;
    }

    if (!deferredPrompt) {
      console.log("Installation prompt not available");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
      setIsAppInstalled(true);
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the saved prompt as it can't be used again
    setDeferredPrompt(null);
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      {!isAppInstalled && (deferredPrompt || isIOS) && (
        <div>
          <button
            onClick={handleInstallClick}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-500 transition-colors duration-200"
            aria-label="Install App"
            title={isIOS ? "Install on iOS" : "Install App"}
          >
            <Download className="w-5 h-5 text-base-content" />
          </button>

          {/* iOS Installation Instructions */}
          {isIOS && iOSInstructionsVisible && (
            <div className="absolute top-12 right-0 w-64 p-4 bg-base-100 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <h4 className="text-sm font-medium mb-2 text-base-content">
                Install Notes Aid
              </h4>
              <ol className="text-xs text-base-content space-y-1">
                <li>1. Tap the Share button</li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
                <li>3. Tap "Add" to install</li>
              </ol>
              <button
                onClick={() => setIOSInstructionsVisible(false)}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
