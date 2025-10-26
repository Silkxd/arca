import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calculator, DollarSign, FileText, Building2, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { usePJControlStore, PJRecordFormData, PJFinancialRecord, BillingCalculation } from '../../store/pjControlStore';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PJSummaryModal } from '../ui/PJSummaryModal';
import { LoadingSpinner, LoadingCard } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorBoundary';

interface RecordFormProps {
  record?: PJFinancialRecord;
  onSubmit: (data: PJRecordFormData) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ record, onSubmit, onCancel }) => {
  const { responsibles, fetchResponsibles, addResponsible } = usePJControlStore();
  const [formData, setFormData] = useState<PJRecordFormData>({
    type: record?.type || 'receita',
    amount: record?.amount || 0,
    description: record?.description || '',
    responsible: record?.responsible || '',
    month_year: record?.month_year || new Date().toISOString().slice(0, 7)
  });
  const [showResponsibleDropdown, setShowResponsibleDropdown] = useState(false);
  const [responsibleInput, setResponsibleInput] = useState(record?.responsible || '');

  useEffect(() => {
    fetchResponsibles();
  }, [fetchResponsibles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setShowResponsibleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If responsible is new, add it to the database
    if (responsibleInput && !responsibles.find(r => r.name === responsibleInput)) {
      try {
        await addResponsible(responsibleInput);
      } catch (error) {
        console.error('Error adding responsible:', error);
      }
    }
    
    onSubmit({ ...formData, responsible: responsibleInput });
  };

  const filteredResponsibles = responsibles.filter(r => 
    r.name.toLowerCase().includes(responsibleInput.toLowerCase())
  );

  const handleResponsibleSelect = (name: string) => {
    setResponsibleInput(name);
    setFormData({ ...formData, responsible: name });
    setShowResponsibleDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {record ? 'Editar' : 'Novo'} {formData.type === 'receita' ? 'Receita' : 'Retirada'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'receita' | 'retirada' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="receita">Receita</option>
              <option value="retirada">Retirada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descrição da receita/retirada"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsável
            </label>
            <div className="relative">
              <input
                type="text"
                value={responsibleInput}
                onChange={(e) => {
                  setResponsibleInput(e.target.value);
                  setFormData({ ...formData, responsible: e.target.value });
                  setShowResponsibleDropdown(true);
                }}
                onFocus={() => setShowResponsibleDropdown(true)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Digite ou selecione um responsável"
                required
              />
              <button
                type="button"
                onClick={() => setShowResponsibleDropdown(!showResponsibleDropdown)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showResponsibleDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredResponsibles.length > 0 ? (
                    filteredResponsibles.map((responsible) => (
                      <button
                        key={responsible.id}
                        type="button"
                        onClick={() => handleResponsibleSelect(responsible.name)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white first:rounded-t-xl last:rounded-b-xl"
                      >
                        {responsible.name}
                      </button>
                    ))
                  ) : responsibleInput ? (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                      Pressione Enter para adicionar "{responsibleInput}"
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                      Nenhum responsável encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mês/Ano
            </label>
            <input
              type="month"
              value={formData.month_year}
              onChange={(e) => setFormData({ ...formData, month_year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              {record ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BillingCalculatorProps {
  onClose: () => void;
}

const BillingCalculator: React.FC<BillingCalculatorProps> = ({ onClose }) => {
  const [revenue, setRevenue] = useState<number>(0);
  const { calculateBilling } = usePJControlStore();
  
  const calculation: BillingCalculation = calculateBilling(revenue);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Calculadora de Faturamento
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Input de Faturamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Faturamento Bruto (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
              placeholder="0.00"
            />
          </div>

          {/* Resultados dos Cálculos */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Pró-labore (28%)
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(calculation.proLabore)}
                </span>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Imposto Pró-labore
                  </span>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    (Pró-labore × 27,5%) - R$ 908,73
                  </div>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(calculation.proLaboreTax)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Imposto Simples (6%)
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(calculation.simplesTax)}
                </span>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Total de Impostos
                </span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(calculation.totalTaxes)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor Líquido
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(revenue - calculation.totalTaxes)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            Fechar Calculadora
          </button>
        </div>
      </div>
    </div>
  );
};

export const PJFinancialControl: React.FC = () => {
  const {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    toggleNFStatus,
    getMonthlyStats,
    calculateBilling
  } = usePJControlStore();

  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PJFinancialRecord | undefined>();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    recordId: string;
    recordDescription: string;
  }>({
    isOpen: false,
    recordId: '',
    recordDescription: ''
  });

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setShowForm(true);
  };

  const handleEditRecord = (record: PJFinancialRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteRecord(id);
      setDeleteModal({ isOpen: false, recordId: '', recordDescription: '' });
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
    }
  };

  const openDeleteModal = (record: PJFinancialRecord) => {
    setDeleteModal({
      isOpen: true,
      recordId: record.id,
      recordDescription: record.description
    });
  };

  const handleSubmitForm = async (data: PJRecordFormData) => {
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, data);
      } else {
        await addRecord(data);
      }
      setShowForm(false);
      setEditingRecord(undefined);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleNFToggle = async (id: string, nfEmitted: boolean) => {
    await toggleNFStatus(id, nfEmitted);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + '-01').toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para extrair anos disponíveis dos dados
  const getAvailableYears = () => {
    const years = records.map(record => record.month_year.split('-')[0]);
    const uniqueYears = [...new Set(years)].sort((a, b) => parseInt(b) - parseInt(a));
    return uniqueYears;
  };

  // Função para obter meses disponíveis para o ano selecionado
  const getAvailableMonthsForYear = (year: string) => {
    if (year === 'all') return [];
    return records
      .filter(record => record.month_year.startsWith(year))
      .map(record => record.month_year)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  };

  // Função para filtrar registros por ano e mês
  const getFilteredRecords = () => {
    let filtered = records;
    
    // Se um ano específico foi selecionado
    if (selectedYear !== 'all') {
      filtered = filtered.filter(record => record.month_year.startsWith(selectedYear));
      
      // Se também um mês específico foi selecionado
      if (selectedMonth) {
        filtered = filtered.filter(record => record.month_year === selectedMonth);
      }
    } else {
      // Se "Todos os anos" está selecionado, não aplicar filtro de ano
      // mas ainda pode filtrar por mês se especificado
      if (selectedMonth) {
        filtered = filtered.filter(record => record.month_year === selectedMonth);
      }
    }
    
    return filtered;
  };

  // Função para calcular estatísticas baseadas nos filtros
  const getFilteredStats = () => {
    const filtered = getFilteredRecords();
    
    const totalReceitas = filtered
      .filter(r => r.type === 'receita')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalRetiradas = filtered
      .filter(r => r.type === 'retirada')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const nfPendentes = filtered
      .filter(r => r.type === 'receita' && !r.nf_issued)
      .length;

    return {
      totalReceitas,
      totalRetiradas,
      saldo: totalReceitas - totalRetiradas,
      nfPendentes
    };
  };

  const monthlyStats = selectedMonth ? getMonthlyStats(selectedMonth) : getFilteredStats();
  const filteredRecords = getFilteredRecords();

  // Função para gerar dados do resumo PJ
  const generateSummaryData = () => {
    const totalRevenue = monthlyStats.totalReceitas;
    const calculation = calculateBilling(totalRevenue);
    
    return {
      totalRevenue,
      simplesTax: calculation.simplesTax,
      proLabore: calculation.proLabore,
      proLaboreTax: calculation.proLaboreTax,
      totalTaxes: calculation.totalTaxes,
      netRevenue: totalRevenue - calculation.totalTaxes
    };
  };

  if (loading && records.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      <ErrorMessage 
        error={error} 
        onRetry={() => fetchRecords()} 
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Controle Financeiro - Pessoa Jurídica
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie receitas, retiradas e calcule impostos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4" />
            Resumo PJ
          </button>
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculadora
          </button>
          <button
            onClick={handleAddRecord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Registro
          </button>
        </div>
      </div>

      {/* Filtros e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtrar por Ano
          </label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              if (e.target.value !== 'all') {
                setSelectedMonth('');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os anos</option>
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtrar por Mês
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={selectedYear === 'all'}
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Receitas</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyStats.totalReceitas)}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Retiradas</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(monthlyStats.totalRetiradas)}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Saldo</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(monthlyStats.saldo)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedYear === 'all' 
              ? 'Todos os Registros' 
              : selectedMonth 
                ? `Registros de ${formatDate(selectedMonth)}`
                : `Registros de ${selectedYear}`
            }
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Descrição
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Responsável
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                  NF Emitida
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      record.type === 'receita'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {record.type === 'receita' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {record.type === 'receita' ? 'Receita' : 'Retirada'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {record.responsible}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.type === 'receita' ? (
                      <button
                        onClick={() => handleNFToggle(record.id, !record.nf_issued)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          record.nf_issued
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {record.nf_issued ? 'Emitida' : 'Pendente'}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(record)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum registro encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Adicione receitas e retiradas para {formatDate(selectedMonth)}
            </p>
            <button
              onClick={handleAddRecord}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Registro
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <RecordForm
          record={editingRecord}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowForm(false);
            setEditingRecord(undefined);
          }}
        />
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <BillingCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* PJ Summary Modal */}
      {showSummary && (
        <PJSummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          monthYear={selectedMonth}
          summaryData={generateSummaryData()}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Excluir Registro"
        message={`Tem certeza que deseja excluir o registro "${deleteModal.recordDescription}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={() => handleDeleteRecord(deleteModal.recordId)}
         onClose={() => setDeleteModal({ isOpen: false, recordId: '', recordDescription: '' })}
         type="danger"
      />
    </div>
  );
};