import React from 'react';
import { Plus, DollarSign, Link, Settings, Shield, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLinkStore } from '../../store/linkStore';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  action?: () => void;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { links, linkGroups } = useLinkStore();

  const actions: QuickAction[] = [
    {
      id: 'add-transaction',
      title: 'Transação',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'blue',
      path: '/finance'
    },
    {
      id: 'add-link',
      title: 'Novo Link',
      icon: <Link className="w-5 h-5" />,
      color: 'purple',
      path: '/links'
    },
    {
      id: 'settings',
      title: 'Config',
      icon: <Settings className="w-5 h-5" />,
      color: 'orange',
      path: '/settings'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
        icon: 'text-emerald-600',
        border: 'border-emerald-200 dark:border-emerald-800'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
        icon: 'text-blue-600',
        border: 'border-blue-200 dark:border-blue-800'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
        icon: 'text-purple-600',
        border: 'border-purple-200 dark:border-purple-800'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30',
        icon: 'text-orange-600',
        border: 'border-orange-200 dark:border-orange-800'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.action) {
      action.action();
    } else {
      navigate(action.path);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
          <Plus className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ações Rápidas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Acesso rápido e resumos importantes
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {actions.map((action) => {
          const colorClasses = getColorClasses(action.color);
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`p-4 rounded-xl border transition-all duration-200 group ${colorClasses.bg} ${colorClasses.border} flex flex-col items-center justify-center min-h-[80px] hover:scale-105`}
            >
              <div className={`${colorClasses.icon} group-hover:scale-110 transition-transform mb-2`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-900 dark:text-white text-xs text-center leading-tight">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Security and Organization Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Security Summary */}
        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Segurança
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Sistema seguro
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Backup automático
              </span>
            </div>
          </div>
        </div>

        {/* Organization Summary */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Organização
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Grupos de links</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {linkGroups.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Links salvos</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {links.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};