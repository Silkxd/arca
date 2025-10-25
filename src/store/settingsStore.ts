import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'pt' | 'en';

interface SecuritySettings {
  autoLockEnabled: boolean;
  autoLockTime: number; // minutes
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  securityAlerts: boolean;
  financialReminders: boolean;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
}

interface SettingsState {
  // Theme
  theme: Theme;
  
  // Language
  language: Language;
  
  // Security
  security: SecuritySettings;
  
  // Notifications
  notifications: NotificationSettings;
  
  // Privacy
  privacy: PrivacySettings;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  updateSecurity: (settings: Partial<SecuritySettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings = {
  theme: 'system' as Theme,
  language: 'pt' as Language,
  security: {
    autoLockEnabled: false,
    autoLockTime: 15,
    biometricEnabled: false,
    twoFactorEnabled: false,
    sessionTimeout: 60
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    financialReminders: true
  },
  privacy: {
    dataCollection: false,
    analytics: false,
    crashReports: true
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      updateSecurity: (settings: Partial<SecuritySettings>) => {
        set(state => ({
          security: { ...state.security, ...settings }
        }));
      },

      updateNotifications: (settings: Partial<NotificationSettings>) => {
        set(state => ({
          notifications: { ...state.notifications, ...settings }
        }));
      },

      updatePrivacy: (settings: Partial<PrivacySettings>) => {
        set(state => ({
          privacy: { ...state.privacy, ...settings }
        }));
      },

      resetToDefaults: () => {
        set(defaultSettings);
        
        // Reset theme
        const root = document.documentElement;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },

      exportSettings: () => {
        const state = get();
        const exportData = {
          theme: state.theme,
          language: state.language,
          security: state.security,
          notifications: state.notifications,
          privacy: state.privacy,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
      },

      importSettings: (settingsJson: string) => {
        try {
          const importedSettings = JSON.parse(settingsJson);
          
          // Validate structure
          if (!importedSettings.version || !importedSettings.theme) {
            return false;
          }
          
          set({
            theme: importedSettings.theme || defaultSettings.theme,
            language: importedSettings.language || defaultSettings.language,
            security: { ...defaultSettings.security, ...importedSettings.security },
            notifications: { ...defaultSettings.notifications, ...importedSettings.notifications },
            privacy: { ...defaultSettings.privacy, ...importedSettings.privacy }
          });
          
          // Apply theme
          get().setTheme(importedSettings.theme);
          
          return true;
        } catch (error) {
          console.error('Error importing settings:', error);
          return false;
        }
      }
    }),
    {
      name: 'arca-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        security: state.security,
        notifications: state.notifications,
        privacy: state.privacy
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration to ensure sync
        if (state?.theme) {
          const { setTheme } = useSettingsStore.getState();
          setTheme(state.theme);
        }
      }
    }
  )
);

// Initialize theme on app start
export const initializeTheme = () => {
  const { theme, setTheme } = useSettingsStore.getState();
  
  // Force apply theme on initialization to ensure sync
  setTheme(theme);
  
  // Listen for system theme changes
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (useSettingsStore.getState().theme === 'system') {
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
};