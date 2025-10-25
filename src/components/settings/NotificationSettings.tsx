import React from 'react';
import { Bell, Mail, Shield, DollarSign, Smartphone } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const NotificationSettings: React.FC = () => {
  const { notifications, updateNotifications } = useSettingsStore();

  const notificationTypes = [
    {
      key: 'emailNotifications' as const,
      icon: <Mail className="w-5 h-5" />,
      title: 'Notificações por Email',
      description: 'Receba atualizações importantes por email',
      color: 'blue'
    },
    {
      key: 'pushNotifications' as const,
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Notificações Push',
      description: 'Receba notificações em tempo real no dispositivo',
      color: 'green'
    },
    {
      key: 'securityAlerts' as const,
      icon: <Shield className="w-5 h-5" />,
      title: 'Alertas de Segurança',
      description: 'Seja notificado sobre atividades suspeitas',
      color: 'red'
    },
    {
      key: 'financialReminders' as const,
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Lembretes Financeiros',
      description: 'Receba lembretes sobre metas e gastos',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600' },
      green: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600' },
      red: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configurações de Notificação
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Escolha como e quando você deseja receber notificações
        </p>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        {notificationTypes.map(type => {
          const colorClasses = getColorClasses(type.color);
          const isEnabled = notifications[type.key];
          
          return (
            <div
              key={type.key}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 ${colorClasses.bg} rounded-xl`}>
                  <div className={colorClasses.text}>
                    {type.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {type.title}
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => updateNotifications({ [type.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Resumo das Notificações
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Ativas:</strong> {Object.values(notifications).filter(Boolean).length} de {Object.keys(notifications).length}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(notifications).map(([key, enabled]) => {
                  const type = notificationTypes.find(t => t.key === key);
                  if (!type) return null;
                  
                  return (
                    <span
                      key={key}
                      className={`px-2 py-1 rounded-lg text-xs ${
                        enabled
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {type.title}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Modo Não Perturbe
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Configure horários em que não deseja receber notificações
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Início
                </label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fim
                </label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Aplicar apenas em dias úteis
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};