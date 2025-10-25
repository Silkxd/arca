import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface PJFinancialRecord {
  id: string;
  user_id: string;
  type: 'receita' | 'retirada';
  amount: number;
  responsible: string;
  month_year: string;
  nf_issued: boolean;
  nf_issued_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PJRecordFormData {
  type: 'receita' | 'retirada';
  amount: number;
  responsible: string;
  month_year: string;
  description?: string;
}

export interface BillingCalculation {
  billing: number;
  proLabore: number;
  proLaboreTax: number;
  simplesTax: number;
  totalTaxes: number;
}

interface PJControlStore {
  records: PJFinancialRecord[];
  loading: boolean;
  error: string | null;
  selectedMonth: string;

  // Actions
  setSelectedMonth: (month: string) => void;
  fetchRecords: () => Promise<void>;
  addRecord: (data: PJRecordFormData) => Promise<void>;
  updateRecord: (id: string, data: Partial<PJRecordFormData>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  toggleNFStatus: (id: string, issued: boolean) => Promise<void>;
  calculateBilling: (billing: number) => BillingCalculation;
  getMonthlyStats: (monthYear: string) => {
    totalReceitas: number;
    totalRetiradas: number;
    saldo: number;
    nfPendentes: number;
  };
  getRecordsByMonth: (monthYear: string) => PJFinancialRecord[];
}

export const usePJControlStore = create<PJControlStore>((set, get) => ({
  records: [],
  loading: false,
  error: null,
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format

  setSelectedMonth: (month) => set({ selectedMonth: month }),

  fetchRecords: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pj_financial_control')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ records: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addRecord: async (data) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('pj_financial_control')
        .insert([{
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRecord: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('pj_financial_control')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRecord: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('pj_financial_control')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleNFStatus: async (id, issued) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('pj_financial_control')
        .update({
          nf_issued: issued,
          nf_issued_date: issued ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  calculateBilling: (billing) => {
    // Pró-labore: 28% do faturamento
    const proLabore = billing * 0.28;
    
    // Imposto do pró-labore: (pró-labore * 27,5%) - 908,73 (mínimo 0)
    const proLaboreTax = Math.max(0, (proLabore * 0.275) - 908.73);
    
    // Imposto do Simples: faturamento * 6%
    const simplesTax = billing * 0.06;
    
    // Total de impostos
    const totalTaxes = proLaboreTax + simplesTax;

    return {
      billing,
      proLabore,
      proLaboreTax,
      simplesTax,
      totalTaxes
    };
  },

  getMonthlyStats: (monthYear) => {
    const { records } = get();
    const monthRecords = records.filter(r => r.month_year === monthYear);
    
    const totalReceitas = monthRecords
      .filter(r => r.type === 'receita')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalRetiradas = monthRecords
      .filter(r => r.type === 'retirada')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const nfPendentes = monthRecords
      .filter(r => r.type === 'receita' && !r.nf_issued)
      .length;

    return {
      totalReceitas,
      totalRetiradas,
      saldo: totalReceitas - totalRetiradas,
      nfPendentes
    };
  },

  getRecordsByMonth: (monthYear) => {
    const { records } = get();
    return records.filter(r => r.month_year === monthYear);
  }
}));