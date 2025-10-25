import React from 'react';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete
}) => {
  const isIncome = transaction.type === 'income';
  const amount = Number(transaction.amount);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${
              isIncome 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-600'
            }`}>
              {isIncome ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {transaction.description}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transaction.category}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              isIncome ? 'text-green-600' : 'text-red-600'
            }`}>
              {isIncome ? '+' : '-'}{formatCurrency(amount)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(transaction.transaction_date)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};