import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';

interface FocoContextType {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isLoading: boolean;
  hasError: boolean;
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean) => void;
  handleIframeLoad: () => void;
  handleIframeError: () => void;
  handleRetry: () => void;
}

const FocoContext = createContext<FocoContextType | undefined>(undefined);

interface FocoProviderProps {
  children: ReactNode;
}

export const FocoProvider: React.FC<FocoProviderProps> = ({ children }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by changing src
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const value: FocoContextType = {
    iframeRef,
    isLoading,
    hasError,
    setIsLoading,
    setHasError,
    handleIframeLoad,
    handleIframeError,
    handleRetry,
  };

  return (
    <FocoContext.Provider value={value}>
      {children}
      {/* Iframe persistente - sempre renderizado mas oculto quando não na página Foco */}
      <iframe
        ref={iframeRef}
        src="https://meufoco.vercel.app"
        className="fixed inset-0 w-full h-full border-0 z-[-1] opacity-0 pointer-events-none"
        title="Sistema Foco"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
        style={{ display: 'none' }}
      />
    </FocoContext.Provider>
  );
};

export const useFoco = (): FocoContextType => {
  const context = useContext(FocoContext);
  if (!context) {
    throw new Error('useFoco must be used within a FocoProvider');
  }
  return context;
};