import React from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useSettingsStore, Theme } from '../../store/settingsStore';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useSettingsStore();

  const themes: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun className="w-4 h-4" />,
      description: 'Interface clara'
    },
    {
      value: 'dark',
      label: 'Escuro',
      icon: <Moon className="w-4 h-4" />,
      description: 'Interface escura'
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Segue o sistema'
    }
  ];



  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tema da Interface
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Escolha como você prefere visualizar o aplicativo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map(themeOption => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              theme === themeOption.value
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                theme === themeOption.value
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {themeOption.icon}
              </div>
              <span className={`font-medium ${
                theme === themeOption.value
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {themeOption.label}
              </span>
            </div>
            <p className={`text-sm ${
              theme === themeOption.value
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {themeOption.description}
            </p>
          </button>
        ))}
      </div>

      {/* Theme Preview */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Pré-visualização
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Exemplo de Card
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Assim ficará a interface
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg">
              Botão Primário
            </button>
            <button className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg">
              Botão Secundário
            </button>
          </div>
        </div>
        

      </div>
    </div>
  );
};