import React, { useEffect, useState } from 'react';
import { Clock, DollarSign, Link, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useLinkStore } from '../../store/linkStore';

interface ActivityItem {
  id: string;
  type: 'transaction' | 'link';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

export const RecentActivity: React.FC = () => {
  const { transactions } = useFinanceStore();
  const { links } = useLinkStore();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);

  useEffect(() => {
    const recentActivities: ActivityItem[] = [];

    // Add recent transactions (last 3)
    const recentTransactions = Array.isArray(transactions)
      ? transactions
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
      : [];
    
    recentTransactions.forEach(transaction => {
      recentActivities.push({
        id: `transaction-${transaction.id}`,
        type: 'transaction',
        title: transaction.description,
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'}: R$ ${transaction.amount.toFixed(2)}`,
        timestamp: transaction.created_at,
        icon: transaction.type === 'income' 
          ? <TrendingUp className="w-4 h-4" />
          : <TrendingDown className="w-4 h-4" />,
        color: transaction.type === 'income' ? 'green' : 'red'
      });
    });

    // Add recent links (last 3)
    const recentLinks = Array.isArray(links)
      ? links
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
      : [];
    
    recentLinks.forEach(link => {
      recentActivities.push({
        id: `link-${link.id}`,
        type: 'link',
        title: link.title,
        description: `Novo link salvo`,
        timestamp: link.created_at,
        icon: <Link className="w-4 h-4" />,
        color: 'purple'
      });
    });

    // Sort all activities by timestamp
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivities(sortedActivities);
  }, [transactions, links]);

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        icon: 'text-emerald-600'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'text-green-600'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        icon: 'text-red-600'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suas últimas ações no app
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma atividade recente
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Comece usando o app para ver suas atividades aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Atividade Recente
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suas últimas ações no app
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.slice(0, isExpanded ? activities.length : displayLimit).map((activity) => {
          const colorClasses = getColorClasses(activity.color);
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-xl ${colorClasses.bg}`}>
                <div className={colorClasses.icon}>
                  {activity.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {activities.length > displayLimit && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Mostrar mais ({activities.length - displayLimit} itens)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};