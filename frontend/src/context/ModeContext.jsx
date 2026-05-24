import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ModeContext = createContext();

// The two modes available in VeriScan
export const MODES = {
  ACADEMIC: 'academic',
  GENERAL: 'general',
};

// Provider component — wrap this around the app
export const ModeProvider = ({ children }) => {
  // Load saved mode from localStorage, default to academic
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('veriscan-mode');
    return saved === MODES.GENERAL ? MODES.GENERAL : MODES.ACADEMIC;
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('veriscan-mode', mode);
  }, [mode]);

  // Toggle between academic and general
  const toggleMode = () => {
    setMode(prev => prev === MODES.ACADEMIC ? MODES.GENERAL : MODES.ACADEMIC);
  };

  // Check which mode is active
  const isAcademic = mode === MODES.ACADEMIC;
  const isGeneral = mode === MODES.GENERAL;

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, isAcademic, isGeneral }}>
      {children}
    </ModeContext.Provider>
  );
};

// Custom hook — use this in any component to access the mode
export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

export default ModeContext;
