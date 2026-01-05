import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface NavigationContextType {
  isRunningForwards: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isRunningForwards, setIsRunningForwards] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const isBackwards = e.shiftKey;
        
        // Update React state (for logic that strictly needs it)
        setIsRunningForwards(!isBackwards);

        // Update DOM directly for performance (CSS styling)
        if (isBackwards) {
          document.body.classList.add('nav-backward');
        } else {
          document.body.classList.remove('nav-backward');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NavigationContext.Provider value={{ isRunningForwards }}>
      {children}
    </NavigationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}