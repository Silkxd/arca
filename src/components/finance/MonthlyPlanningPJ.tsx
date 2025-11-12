import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calculator, DollarSign, Building2 } from 'lucide-react';
import { usePlanningStore, MonthlyPlanning, PlanningFormData } from '../../store/planningStore';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface PlanningFormProps {
  planning?: MonthlyPlanning;
  onSubmit: (data: PlanningFormData) => void;
  onCancel: () => void;
}

const PlanningForm: React.FC<PlanningFormProps> = ({ planning, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PlanningFormData>({
    type: 'PJ',
    category_name: planning?.category_name || '',
    formula: planning?.formula || '',
    base_value: planning?.base_value || 0,
    end_month: planning?.end_month || ''
  });

  const { calculateFormula } = usePlanningStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se há fórmula, calcular o valor base
    const finalData = {
      ...formData,
      base_value: formData.formula ? calculateFormula(formData.formula) : formData.base_value
    };

    onSubmit(finalData);
  };

  const previewValue = formData.formula ? calculateFormula(formData.formula) : formData.base_value;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {planning ? 'Editar' : 'Nova'} Categoria PJ
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Aluguel Escritório, Contador..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fórmula ou Valor Fixo
            </label>
            <input
              type="text"
              value={formData.formula}
              onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: (5000-8%)-800 ou deixe vazio para valor fixo"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use fórmulas como: (5000-8%)-800, 2000*1.2, etc.
            </p>
          </div>

          {!formData.formula && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor Fixo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.base_value}
                onChange={(e) => setFormData({ ...formData, base_value: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mês Limite (Opcional)
            </label>
            <input
              type="month"
              value={formData.end_month}
              onChange={(e) => setFormData({ ...formData, end_month: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Deixe vazio para repetir indefinidamente
            </p>
          </div>

          {/* Preview do valor calculado */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Valor Calculado:
              </span>
              <span className="text-lg font-bold text-blue-600">
                R$ {previewValue.toFixed(2)}
              </span>
            </div>
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
              {planning ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MonthlyPlanningPJ: React.FC = () => {
  const {
    plannings,
    planningValues,
    loading,
    selectedMonth,
    setSelectedMonth,
    fetchPlannings,
    fetchPlanningValues,
    addPlanning,
    updatePlanning,
    deletePlanning,
    updatePlanningValue,
    togglePaymentStatus,
    calculateFormula,
    getMonthlyTotal,
    getMonthlyPendingTotal,
    getPlanningsByType
  } = usePlanningStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<MonthlyPlanning | undefined>();
  const [editingValue, setEditingValue] = useState<{ planningId: string; monthYear: string; value: number } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    planningId: string;
    planningName: string;
  }>({
    isOpen: false,
    planningId: '',
    planningName: ''
  });

  useEffect(() => {
    fetchPlannings();
    fetchPlanningValues();
  }, [fetchPlannings, fetchPlanningValues]);

  const pjPlannings = getPlanningsByType('PJ');

  // Gerar lista de meses (6 meses: atual + 5 próximos)
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthYear = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      months.push({ value: monthYear, label: monthName });
    }
    
    return months;
  };

  const months = generateMonths();

  const handleAddPlanning = () => {
    setEditingPlanning(undefined);
    setShowForm(true);
  };

  const handleEditPlanning = (planning: MonthlyPlanning) => {
    setEditingPlanning(planning);
    setShowForm(true);
  };

  const handleDeletePlanning = async (id: string) => {
    try {
      await deletePlanning(id);
      setDeleteModal({ isOpen: false, planningId: '', planningName: '' });
    } catch (error) {
      console.error('Erro ao excluir planejamento:', error);
    }
  };

  const openDeleteModal = (planning: MonthlyPlanning) => {
    setDeleteModal({
      isOpen: true,
      planningId: planning.id,
      planningName: planning.category_name
    });
  };

  const handleSubmitForm = async (data: PlanningFormData) => {
    try {
      if (editingPlanning) {
        await updatePlanning(editingPlanning.id, data);
      } else {
        await addPlanning(data);
      }
      setShowForm(false);
      setEditingPlanning(undefined);
    } catch (error) {
      console.error('Error saving planning:', error);
    }
  };

  const getPlanningValue = (planningId: string, monthYear: string) => {
    const value = planningValues.find(
      v => v.planning_id === planningId && v.month_year === monthYear
    );
    
    if (value) return value;
    
    // Se não existe valor específico, usar o valor base ou calcular fórmula
    const planning = plannings.find(p => p.id === planningId);
    if (planning) {
      const calculatedValue = planning.formula 
        ? calculateFormula(planning.formula) 
        : planning.base_value;
      
      return {
        id: '',
        planning_id: planningId,
        month_year: monthYear,
        value: calculatedValue,
        is_paid: false,
        created_at: ''
      };
    }
    
    return null;
  };

  const handleValueEdit = (planningId: string, monthYear: string, currentValue: number) => {
    setEditingValue({ planningId, monthYear, value: currentValue });
  };

  const handleValueSave = async () => {
    if (!editingValue) return;
    
    try {
      await updatePlanningValue(editingValue.planningId, editingValue.monthYear, editingValue.value);
      setEditingValue(null);
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  const handlePaymentToggle = async (planningId: string, monthYear: string, isPaid: boolean) => {
    const value = planningValues.find(
      v => v.planning_id === planningId && v.month_year === monthYear
    );
    
    if (value) {
      await togglePaymentStatus(value.id, isPaid);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Planejamento Mensal - Pessoa Jurídica
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os gastos empresariais com fórmulas e valores fixos
          </p>
        </div>
        <button
          onClick={handleAddPlanning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Tabela de Planejamento */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <table className="w-full">
            <thead className="bg-blue-50 dark:bg-blue-900/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Categoria Empresarial
                </th>
                {months.map(month => {
                  const isCurrentMonth = month.value === new Date().toISOString().slice(0, 7);
                  return (
                    <th key={month.value} className={`px-4 py-4 text-center text-sm font-medium min-w-[120px] ${
                      isCurrentMonth 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-l-2 border-r-2 border-blue-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {month.label}
                      {isCurrentMonth && <div className="text-xs font-normal">(Atual)</div>}
                    </th>
                  );
                })}
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pjPlannings.map((planning) => (
                <tr key={planning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        {planning.category_name}
                      </div>
                      {planning.formula && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Fórmula: {planning.formula}
                        </div>
                      )}
                      {planning.end_month && (
                        <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                          Até: {new Date(planning.end_month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </td>
                  {months.map(month => {
                    const planningValue = getPlanningValue(planning.id, month.value);
                    const isEditing = editingValue?.planningId === planning.id && editingValue?.monthYear === month.value;
                    const isCurrentMonth = month.value === new Date().toISOString().slice(0, 7);
                    
                    // Verificar se a categoria está ativa neste mês
                    const isActiveInMonth = !planning.end_month || new Date(`${month.value}-01`) <= new Date(planning.end_month);
                    
                    return (
                      <td key={month.value} className={`px-4 py-4 text-center ${
                        isCurrentMonth 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-r-2 border-blue-400' 
                          : ''
                      } ${!isActiveInMonth ? 'opacity-30' : ''}`}>
                        <div className="space-y-2">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.01"
                                value={editingValue.value}
                                onChange={(e) => setEditingValue({
                                  ...editingValue,
                                  value: parseFloat(e.target.value) || 0
                                })}
                                className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <button
                                onClick={handleValueSave}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingValue(null)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => isActiveInMonth && handleValueEdit(planning.id, month.value, planningValue?.value || 0)}
                              className={`text-sm font-medium ${isActiveInMonth ? 'text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                              disabled={!isActiveInMonth}
                            >
                              {isActiveInMonth ? formatCurrency(planningValue?.value || 0) : '-'}
                            </button>
                          )}
                          
                          {planningValue && isActiveInMonth && (
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handlePaymentToggle(planning.id, month.value, !planningValue.is_paid)}
                                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                  planningValue.is_paid
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                                }`}
                              >
                                {planningValue.is_paid ? 'Pago' : 'Pendente'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditPlanning(planning)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(planning)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Linha de Total */}
              <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold">
                <td className="px-6 py-4 text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total do Mês
                  </div>
                </td>
                {months.map(month => {
                  const isCurrentMonth = month.value === new Date().toISOString().slice(0, 7);
                  return (
                    <td key={month.value} className={`px-4 py-4 text-center text-blue-700 dark:text-blue-300 ${
                      isCurrentMonth 
                        ? 'bg-blue-100 dark:bg-blue-900/40 border-l-2 border-r-2 border-blue-400' 
                        : ''
                    }`}>
                      {formatCurrency(getMonthlyTotal(month.value, 'PJ'))}
                    </td>
                  );
                })}
                <td className="px-6 py-4"></td>
              </tr>
              
              {/* Linha de Pendente */}
              <tr className="bg-orange-50 dark:bg-orange-900/20 font-medium">
                <td className="px-6 py-4 text-orange-700 dark:text-orange-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Pendente
                  </div>
                </td>
                {months.map(month => {
                  const isCurrentMonth = month.value === new Date().toISOString().slice(0, 7);
                  return (
                    <td key={month.value} className={`px-4 py-4 text-center text-orange-700 dark:text-orange-300 ${
                      isCurrentMonth 
                        ? 'bg-orange-100 dark:bg-orange-900/30 border-l-2 border-r-2 border-orange-400' 
                        : ''
                    }`}>
                      {formatCurrency(getMonthlyPendingTotal(month.value, 'PJ'))}
                    </td>
                  );
                })}
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {pjPlannings.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma categoria empresarial criada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comece criando suas primeiras categorias de gastos empresariais
          </p>
          <button
            onClick={handleAddPlanning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PlanningForm
          planning={editingPlanning}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowForm(false);
            setEditingPlanning(undefined);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, planningId: '', planningName: '' })}
        onConfirm={() => handleDeletePlanning(deleteModal.planningId)}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${deleteModal.planningName}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};