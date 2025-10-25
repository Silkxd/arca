import React from 'react';
import { X, Calculator, DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface PJSummaryData {
  totalRevenue: number;
  simplesTax: number;
  proLabore: number;
  proLaboreTax: number;
  totalTaxes: number;
  netRevenue: number;
}

interface PJSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthYear: string;
  summaryData: PJSummaryData;
}

export const PJSummaryModal: React.FC<PJSummaryModalProps> = ({
  isOpen,
  onClose,
  monthYear,
  summaryData
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Resumo PJ - {formatMonthYear(monthYear)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Análise financeira detalhada do período
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Total de Faturamento */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Total de Faturamento
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Receitas totais do período
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(summaryData.totalRevenue)}
              </span>
            </div>
          </div>

          {/* Pró-labore */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Pró-labore
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    28% do faturamento
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold text-purple-600">
                {formatCurrency(summaryData.proLabore)}
              </span>
            </div>
          </div>

          {/* Impostos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imposto do Simples */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-300">
                    Imposto do Simples
                  </h4>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    6% do faturamento
                  </p>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(summaryData.simplesTax)}
                </span>
              </div>
            </div>

            {/* Imposto Pró-Labore */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Imposto Pró-Labore
                  </h4>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    (Pró-labore × 27,5%) - R$ 908,73
                  </p>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(summaryData.proLaboreTax)}
                </span>
              </div>
            </div>
          </div>

          {/* Total de Impostos */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-300">
                    Total de Impostos
                  </h4>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Simples + Pró-labore
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(summaryData.totalTaxes)}
              </span>
            </div>
          </div>

          {/* Faturamento Líquido */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Faturamento Líquido
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Faturamento - Total de Impostos
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summaryData.netRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Fechar */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            Fechar Resumo
          </button>
        </div>
      </div>
    </div>
  );
};