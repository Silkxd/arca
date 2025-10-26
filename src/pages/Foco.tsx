import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useFoco } from '../contexts/FocoContext';
import { useLocation } from 'react-router-dom';

export const Foco: React.FC = () => {
  const { iframeRef, isLoading, hasError, handleRetry } = useFoco();
  const location = useLocation();

  useEffect(() => {
    // Quando entrar na página Foco, mostrar o iframe
    if (location.pathname === '/foco' && iframeRef.current) {
      iframeRef.current.style.display = 'block';
      iframeRef.current.style.opacity = '1';
      iframeRef.current.style.pointerEvents = 'auto';
      iframeRef.current.style.zIndex = '1';
    }

    // Cleanup: quando sair da página Foco, ocultar o iframe mas mantê-lo carregado
    return () => {
      if (iframeRef.current) {
        iframeRef.current.style.display = 'none';
        iframeRef.current.style.opacity = '0';
        iframeRef.current.style.pointerEvents = 'none';
        iframeRef.current.style.zIndex = '-1';
      }
    };
  }, [location.pathname, iframeRef]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center max-w-md mx-auto px-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Erro ao carregar
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Não foi possível carregar o sistema Foco. Verifique sua conexão com a internet e tente novamente.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* O iframe agora é renderizado pelo FocoProvider e apenas controlamos sua visibilidade */}
        <div className="w-full h-full" />
      </div>
    </div>
  );
};

export default Foco;