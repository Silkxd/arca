// Network utility functions for handling connectivity and retries

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delay: 1000,
  backoff: true
};

/**
 * Check if the error is a network-related error
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  
  return (
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('ERR_NETWORK') ||
    errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
    errorMessage.includes('ERR_ABORTED') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('ENOTFOUND') ||
    errorMessage.includes('ECONNREFUSED') ||
    error.name === 'NetworkError' ||
    error.code === 'NETWORK_ERROR'
  );
};

/**
 * Check if we're currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Wait for a specified amount of time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<T> => {
  const { maxRetries = 3, delay: baseDelay = 1000, backoff = true } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's not a network error
      if (!isNetworkError(error)) {
        throw error;
      }
      
      // Don't retry if we've reached max attempts
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delayMs = backoff ? baseDelay * Math.pow(2, attempt) : baseDelay;
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`, error);
      await delay(delayMs);
    }
  }
  
  throw lastError;
};

/**
 * Create a network-aware wrapper for Supabase operations
 */
export const withNetworkRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: RetryOptions
) => {
  return async (...args: T): Promise<R> => {
    // Check if we're online first
    if (!isOnline()) {
      throw new Error('Sem conexão com a internet');
    }
    
    return retryWithBackoff(() => fn(...args), options);
  };
};

/**
 * Get user-friendly error message based on error type
 */
export const getNetworkErrorMessage = (error: any): string => {
  if (!isOnline()) {
    return 'Sem conexão com a internet - verifique sua conexão';
  }
  
  if (isNetworkError(error)) {
    return 'Erro de conexão - verifique sua internet e tente novamente';
  }
  
  if (error?.message?.includes('Usuário não autenticado')) {
    return 'Sessão expirada - faça login novamente';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Tempo limite excedido - tente novamente';
  }
  
  return 'Erro inesperado - tente novamente em alguns instantes';
};

/**
 * Listen for online/offline events
 */
export const setupNetworkListeners = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  const handleOnline = () => {
    console.log('Network: Back online');
    onOnline?.();
  };
  
  const handleOffline = () => {
    console.log('Network: Gone offline');
    onOffline?.();
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};