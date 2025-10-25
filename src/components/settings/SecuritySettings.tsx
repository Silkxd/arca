import React from 'react';
import { Shield, Clock, Fingerprint, Key, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const SecuritySettings: React.FC = () => {
  const { security, updateSecurity } = useSettingsStore();

  const timeOptions = [
    { value: 5, label: '5 minutos' },
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 120, label: '2 horas' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configurações de Segurança
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gerencie as configurações de segurança e privacidade do aplicativo
        </p>
      </div>

      {/* Auto Lock */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Bloqueio Automático
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.autoLockEnabled}
                  onChange={(e) => updateSecurity({ autoLockEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bloqueia automaticamente o aplicativo após um período de inatividade
            </p>
            
            {security.autoLockEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tempo de inatividade
                </label>
                <select
                  value={security.autoLockTime}
                  onChange={(e) => updateSecurity({ autoLockTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Timeout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Timeout da Sessão
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tempo limite para manter a sessão ativa
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duração da sessão
              </label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => updateSecurity({ sessionTimeout: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={120}>2 horas</option>
                <option value={240}>4 horas</option>
                <option value={480}>8 horas</option>
                <option value={1440}>24 horas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
            <Fingerprint className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Autenticação Biométrica
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.biometricEnabled}
                  onChange={(e) => updateSecurity({ biometricEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use impressão digital ou reconhecimento facial para acessar o aplicativo
            </p>
            {security.biometricEnabled && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  ⚠️ Funcionalidade disponível apenas em dispositivos compatíveis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
            <Key className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Autenticação de Dois Fatores (2FA)
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactorEnabled}
                  onChange={(e) => updateSecurity({ twoFactorEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adiciona uma camada extra de segurança ao seu login
            </p>
            {security.twoFactorEnabled && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ Configure um aplicativo autenticador como Google Authenticator
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Summary */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
              Nível de Segurança
            </h4>
            <div className="space-y-2">
              {security.twoFactorEnabled && security.biometricEnabled && security.autoLockEnabled ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  🛡️ <strong>Alto:</strong> Todas as proteções estão ativas
                </p>
              ) : security.twoFactorEnabled || security.biometricEnabled ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  🔒 <strong>Médio:</strong> Algumas proteções estão ativas
                </p>
              ) : (
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  ⚠️ <strong>Básico:</strong> Considere ativar mais proteções
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};