import React, { useState, useEffect } from 'react';
import { User, Building2, PieChart } from 'lucide-react';
import { MonthlyPlanningPF } from '../components/finance/MonthlyPlanningPF';
import { MonthlyPlanningPJ } from '../components/finance/MonthlyPlanningPJ';
import { PJFinancialControl } from '../components/finance/PJFinancialControl';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

type FinanceTab = 'planning-pf' | 'planning-pj' | 'control-pj';

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('planning-pf');

  const tabs = [
    {
      id: 'planning-pf' as const,
      label: 'Planejamento PF',
      icon: User,
      description: 'Planejamento mensal para pessoa física'
    },
    {
      id: 'planning-pj' as const,
      label: 'Planejamento PJ',
      icon: Building2,
      description: 'Planejamento mensal para pessoa jurídica'
    },
    {
      id: 'control-pj' as const,
      label: 'Controle PJ',
      icon: PieChart,
      description: 'Controle financeiro e faturamento PJ'
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Finanças
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentTab?.description || 'Controle suas receitas e despesas'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <ErrorBoundary>
          {activeTab === 'planning-pf' && <MonthlyPlanningPF />}
          
          {activeTab === 'planning-pj' && <MonthlyPlanningPJ />}
          
          {activeTab === 'control-pj' && <PJFinancialControl />}
        </ErrorBoundary>
      </div>
    </div>
  );
};