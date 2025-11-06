import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  description
}) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-emerald-600',
      text: 'text-emerald-700 dark:text-emerald-300'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600',
      text: 'text-blue-700 dark:text-blue-300'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600',
      text: 'text-purple-700 dark:text-purple-300'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600',
      text: 'text-orange-700 dark:text-orange-300'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600',
      text: 'text-red-700 dark:text-red-300'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow arca-card-elevated">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${classes.bg}`}>
              <Icon className={`w-5 h-5 ${classes.icon}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h3>
          </div>
          
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {description}
            </p>
          )}

          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${
                trend.isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                vs. mês anterior
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};