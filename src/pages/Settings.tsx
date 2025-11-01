import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Shield, 
  Bell, 
  User, 
  Download, 
  Upload, 
  RotateCcw,
  LogOut,
  Trash2
} from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';

type SettingsTab = 'appearance' | 'security' | 'notifications' | 'account' | 'data';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const { exportSettings, importSettings, resetToDefaults } = useSettingsStore();
  const { user, signOut } = useAuthStore();

  const tabs = [
    {
      id: 'appearance' as const,
      label: 'Aparência',
      icon: <Palette className="w-5 h-5" />,
      description: 'Tema e personalização'
    },
    {
      id: 'security' as const,
      label: 'Segurança',
      icon: <Shield className="w-5 h-5" />,
      description: 'Proteção e privacidade'
    },
    {
      id: 'notifications' as const,
      label: 'Notificações',
      icon: <Bell className="w-5 h-5" />,
      description: 'Alertas e lembretes'
    },
    {
      id: 'account' as const,
      label: 'Conta',
      icon: <User className="w-5 h-5" />,
      description: 'Informações pessoais'
    },
    {
      id: 'data' as const,
      label: 'Dados',
      icon: <Download className="w-5 h-5" />,
      description: 'Backup e restauração'
    }
  ];

  const handleExportSettings = () => {
    try {
      const settingsData = exportSettings();
      const blob = new Blob([settingsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arca-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Erro ao exportar configurações');
    }
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const success = importSettings(content);
            if (success) {
              alert('Configurações importadas com sucesso!');
            } else {
              alert('Erro: Arquivo de configurações inválido');
            }
          } catch (error) {
            console.error('Error importing settings:', error);
            alert('Erro ao importar configurações');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    if (window.confirm('Tem certeza que deseja restaurar todas as configurações para o padrão? Esta ação não pode ser desfeita.')) {
      resetToDefaults();
      alert('Configurações restauradas para o padrão!');
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Tem certeza que deseja sair da sua conta?')) {
      await signOut();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <ThemeSelector />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Informações da Conta
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {user?.email || 'Usuário'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Ações da Conta
              </h4>
              <div className="space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sair da Conta
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  onClick={() => alert('Funcionalidade em desenvolvimento')}
                >
                  <Trash2 className="w-5 h-5" />
                  Excluir Conta
                </button>
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gerenciamento de Dados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Faça backup, restaure ou redefina suas configurações
              </p>
            </div>

            {/* Export Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Exportar Configurações
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Baixe um arquivo com todas as suas configurações atuais
                  </p>
                  <button
                    onClick={handleExportSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            {/* Import Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Importar Configurações
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Restaure configurações de um arquivo exportado anteriormente
                  </p>
                  <button
                    onClick={handleImportSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Importar
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Restaurar Padrões
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Restaure todas as configurações para os valores padrão
                  </p>
                  <button
                    onClick={handleResetSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar
                  </button>
                </div>
              </div>
            </div>

            {/* Data Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Informações sobre Dados
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• As configurações são salvas localmente no seu dispositivo</p>
                <p>• Os dados sensíveis (senhas) são criptografados localmente</p>
                <p>• Você pode exportar suas configurações a qualquer momento</p>
                <p>• A exclusão da conta remove todos os dados permanentemente</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-6 max-w-[95%] mx-auto xl:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize sua experiência no Arca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`${
                  activeTab === tab.id 
                    ? 'text-emerald-600' 
                    : 'text-gray-400'
                }`}>
                  {tab.icon}
                </div>
                <div>
                  <p className="font-medium">{tab.label}</p>
                  <p className="text-xs opacity-75">{tab.description}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};