import CryptoJS from 'crypto-js';

// Generate a secure encryption key from user's password/session
export const generateEncryptionKey = (userSecret: string): string => {
  return CryptoJS.SHA256(userSecret + 'arca-salt-2024').toString();
};

// Encrypt password data
export const encryptPassword = (password: string, encryptionKey: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, encryptionKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt password');
  }
};

// Decrypt password data
export const decryptPassword = (encryptedPassword: string, encryptionKey: string): string => {
  try {
    // Validate inputs
    if (!encryptedPassword || !encryptionKey) {
      throw new Error('Missing encrypted password or encryption key');
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey);
    
    // Check if decryption was successful before converting to UTF-8
    if (!decrypted || decrypted.sigBytes <= 0) {
      throw new Error('Invalid decryption key or corrupted data');
    }

    const password = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Additional check for malformed UTF-8 data
    if (!password || password.length === 0) {
      throw new Error('Malformed UTF-8 data or invalid encryption key');
    }
    
    // Validate that the decrypted string contains valid characters
    try {
      // This will throw if the string contains invalid UTF-8 sequences
      encodeURIComponent(password);
    } catch (utf8Error) {
      throw new Error('Malformed UTF-8 data detected');
    }
    
    return password;
  } catch (error) {
    console.error('Decryption error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Malformed UTF-8')) {
        throw new Error('Password data is corrupted or was encrypted with a different key');
      }
      if (error.message.includes('Invalid decryption key')) {
        throw new Error('Unable to decrypt password - invalid key or corrupted data');
      }
    }
    
    throw new Error('Failed to decrypt password - data may be corrupted');
  }
};

// Generic data encryption (for vault items)
export const encryptData = async (data: string): Promise<string> => {
  try {
    // Use a default encryption key for vault data
    // In a production app, this should use user-specific keys
    const encryptionKey = 'vault-encryption-key-2024';
    const encrypted = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Data encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Generic data decryption (for vault items)
export const decryptData = async (encryptedData: string): Promise<string> => {
  try {
    // Use the same encryption key for vault data
    const encryptionKey = 'vault-encryption-key-2024';
    
    if (!encryptedData || !encryptionKey) {
      throw new Error('Missing encrypted data or encryption key');
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    
    if (!decrypted || decrypted.sigBytes <= 0) {
      throw new Error('Invalid decryption key or corrupted data');
    }

    const data = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!data || data.length === 0) {
      throw new Error('Malformed UTF-8 data or invalid encryption key');
    }
    
    return data;
  } catch (error) {
    console.error('Data decryption error:', error);
    throw new Error('Failed to decrypt data - data may be corrupted');
  }
};

// Generate a secure random password
export const generateSecurePassword = (
  length: number = 16,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string => {
  let charset = '';
  
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (!charset) {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Calculate password strength
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Common patterns penalty
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns
  
  score = Math.max(0, Math.min(5, score));
  
  const strengthLevels = [
    { label: 'Muito Fraca', color: '#EF4444' },
    { label: 'Fraca', color: '#F97316' },
    { label: 'Regular', color: '#F59E0B' },
    { label: 'Boa', color: '#10B981' },
    { label: 'Forte', color: '#059669' },
    { label: 'Muito Forte', color: '#047857' }
  ];
  
  return {
    score,
    label: strengthLevels[score].label,
    color: strengthLevels[score].color
  };
};