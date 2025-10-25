import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface MonthlyPlanning {
  id: string;
  user_id: string;
  type: 'PF' | 'PJ';
  category_name: string;
  formula?: string;
  base_value: number;
  end_month?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyPlanningValue {
  id: string;
  planning_id: string;
  month_year: string;
  value: number;
  is_paid: boolean;
  paid_date?: string;
  created_at: string;
}

export interface PlanningFormData {
  type: 'PF' | 'PJ';
  category_name: string;
  formula?: string;
  base_value: number;
  end_month?: string;
}

interface PlanningStore {
  plannings: MonthlyPlanning[];
  planningValues: MonthlyPlanningValue[];
  loading: boolean;
  error: string | null;
  selectedType: 'PF' | 'PJ';
  selectedMonth: string;

  // Actions
  setSelectedType: (type: 'PF' | 'PJ') => void;
  setSelectedMonth: (month: string) => void;
  fetchPlannings: () => Promise<void>;
  fetchPlanningValues: (planningId?: string) => Promise<void>;
  addPlanning: (data: PlanningFormData) => Promise<void>;
  updatePlanning: (id: string, data: Partial<PlanningFormData>) => Promise<void>;
  deletePlanning: (id: string) => Promise<void>;
  updatePlanningValue: (planningId: string, monthYear: string, value: number) => Promise<void>;
  togglePaymentStatus: (valueId: string, isPaid: boolean) => Promise<void>;
  calculateFormula: (formula: string) => number;
  getMonthlyTotal: (monthYear: string, type: 'PF' | 'PJ') => number;
  getMonthlyPendingTotal: (monthYear: string, type: 'PF' | 'PJ') => number;
  getPlanningsByType: (type: 'PF' | 'PJ') => MonthlyPlanning[];
}

export const usePlanningStore = create<PlanningStore>((set, get) => ({
  plannings: [],
  planningValues: [],
  loading: false,
  error: null,
  selectedType: 'PF',
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format

  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),

  fetchPlannings: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('monthly_planning')
        .select('*')
        .order('category_name');

      if (error) throw error;
      set({ plannings: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPlanningValues: async (planningId) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('monthly_planning_values')
        .select('*')
        .order('month_year');

      if (planningId) {
        query = query.eq('planning_id', planningId);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ planningValues: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addPlanning: async (data) => {
    set({ loading: true, error: null });
    try {
      // Validar e formatar o campo end_month
      const processedData = {
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        end_month: data.end_month && data.end_month.trim() !== '' 
          ? (data.end_month.length === 7 ? `${data.end_month}-01` : data.end_month)
          : null
      };

      const { error } = await supabase
        .from('monthly_planning')
        .insert([processedData]);

      if (error) throw error;
      await get().fetchPlannings();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePlanning: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Validar e formatar o campo end_month
      const processedData = {
        ...data,
        updated_at: new Date().toISOString(),
        end_month: data.end_month && data.end_month.trim() !== '' 
          ? (data.end_month.length === 7 ? `${data.end_month}-01` : data.end_month)
          : null
      };

      const { error } = await supabase
        .from('monthly_planning')
        .update(processedData)
        .eq('id', id);

      if (error) throw error;
      await get().fetchPlannings();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deletePlanning: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('monthly_planning')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchPlannings();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePlanningValue: async (planningId, monthYear, value) => {
    set({ loading: true, error: null });
    try {
      // Verificar se já existe um valor para este mês
      const { data: existing } = await supabase
        .from('monthly_planning_values')
        .select('id')
        .eq('planning_id', planningId)
        .eq('month_year', monthYear)
        .single();

      if (existing) {
        // Atualizar valor existente
        const { error } = await supabase
          .from('monthly_planning_values')
          .update({ value })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Criar novo valor
        const { error } = await supabase
          .from('monthly_planning_values')
          .insert([{
            planning_id: planningId,
            month_year: monthYear,
            value
          }]);

        if (error) throw error;
      }

      await get().fetchPlanningValues();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  togglePaymentStatus: async (valueId, isPaid) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('monthly_planning_values')
        .update({
          is_paid: isPaid,
          paid_date: isPaid ? new Date().toISOString() : null
        })
        .eq('id', valueId);

      if (error) throw error;
      await get().fetchPlanningValues();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  calculateFormula: (formula) => {
    try {
      // Substituir % por /100 para cálculos de porcentagem
      const processedFormula = formula.replace(/(\d+)%/g, '($1/100)');
      
      // Usar Function constructor para avaliar a fórmula de forma segura
      // Apenas operações matemáticas básicas são permitidas
      const allowedChars = /^[0-9+\-*/.() ]+$/;
      if (!allowedChars.test(processedFormula)) {
        throw new Error('Fórmula contém caracteres não permitidos');
      }

      const result = Function(`"use strict"; return (${processedFormula})`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Erro ao calcular fórmula:', error);
      return 0;
    }
  },

  getMonthlyTotal: (monthYear, type) => {
    const { plannings, planningValues } = get();
    const typePlannings = plannings.filter(p => {
      // Filtrar por tipo
      if (p.type !== type) return false;
      
      // Verificar se a categoria ainda está ativa no mês solicitado
      if (p.end_month) {
        const endDate = new Date(p.end_month);
        const requestedDate = new Date(`${monthYear}-01`);
        if (requestedDate > endDate) return false;
      }
      
      return true;
    });
    
    let total = 0;
    typePlannings.forEach(planning => {
      const value = planningValues.find(
        v => v.planning_id === planning.id && v.month_year === monthYear
      );
      
      if (value) {
        total += value.value;
      } else if (planning.formula) {
        total += get().calculateFormula(planning.formula);
      } else {
        total += planning.base_value;
      }
    });

    return total;
  },

  getMonthlyPendingTotal: (monthYear, type) => {
    const { plannings, planningValues } = get();
    const typePlannings = plannings.filter(p => {
      // Filtrar por tipo
      if (p.type !== type) return false;
      
      // Verificar se a categoria ainda está ativa no mês solicitado
      if (p.end_month) {
        const endDate = new Date(p.end_month);
        const requestedDate = new Date(`${monthYear}-01`);
        if (requestedDate > endDate) return false;
      }
      
      return true;
    });
    
    let pendingTotal = 0;
    typePlannings.forEach(planning => {
      const value = planningValues.find(
        v => v.planning_id === planning.id && v.month_year === monthYear
      );
      
      // Só conta se existe valor específico e não foi pago
      if (value && !value.is_paid) {
        pendingTotal += value.value;
      } else if (!value) {
        // Se não existe valor específico, considera como pendente usando valor base/fórmula
        if (planning.formula) {
          pendingTotal += get().calculateFormula(planning.formula);
        } else {
          pendingTotal += planning.base_value;
        }
      }
    });

    return pendingTotal;
  },

  getPlanningsByType: (type) => {
    const { plannings } = get();
    return plannings.filter(p => p.type === type);
  }
}));