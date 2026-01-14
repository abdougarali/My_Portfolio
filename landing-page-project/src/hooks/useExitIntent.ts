'use client';

import { useEffect, useState, useRef } from 'react';

export const useExitIntent = (enabled: boolean = true) => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const listenerActiveRef = useRef(false);

  // Check for dev mode (URL parameter: ?testExitIntent=true)
  const isDevMode = typeof window !== 'undefined' && 
                    window.location.search.includes('testExitIntent=true');

  // Custom setter that resets hasShown to allow re-triggering
  const closeExitIntent = () => {
    setShowExitIntent(false);
    // Always allow re-triggering after modal closes
    setHasShown(false);
  };

  useEffect(() => {
    // Don't run if disabled
    if (!enabled) return;

    // Don't set up listener if modal is currently showing
    if (showExitIntent) return;

    // Create the mouse leave handler
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page (e.clientY <= 0)
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    // Add delay before activating (wait 5 seconds on first load, 2 seconds in dev mode)
    const activationDelay = isDevMode ? 2000 : 5000;
    
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      listenerActiveRef.current = true;
    }, activationDelay);

    return () => {
      clearTimeout(timeout);
      if (listenerActiveRef.current) {
        document.removeEventListener('mouseleave', handleMouseLeave);
        listenerActiveRef.current = false;
      }
    };
  }, [enabled, isDevMode, hasShown, showExitIntent]);

  return { showExitIntent, setShowExitIntent: closeExitIntent };
};

