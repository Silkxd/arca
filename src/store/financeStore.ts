import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Transaction, TransactionFormData, Category } from '../types';

interface FinanceStore {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedMonth: string;
  selectedCategory: string;
  selectedType: 'all' | 'income' | 'expense';
  
  // Actions
  setSelectedMonth: (month: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedType: (type: 'all' | 'income' | 'expense') => void;
  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getMonthlyStats: () => {
    income: number;
    expenses: number;
    balance: number;
    transactionCount: number;
  };
  getCategoryStats: () => Array<{
    category: string;
    amount: number;
    count: number;
    color: string;
  }>;
  clearFinance: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  categories: [],
  loading: false,
  error: null,
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
  selectedCategory: '',
  selectedType: 'all',

  setSelectedMonth: (month) => set({ selectedMonth: month }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSelectedType: (type) => set({ selectedType: type }),

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      set({ transactions: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      
      let errorMessage = 'Erro ao carregar transações';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver suas transações';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  fetchCategories: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      let errorMessage = 'Erro ao carregar categorias';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver suas categorias';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ 
        error: errorMessage
      });
    }
  },

  addTransaction: async (data) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: data.type,
          amount: data.amount,
          description: data.description,
          category: data.category,
          transaction_date: data.transaction_date,
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        transactions: [newTransaction, ...state.transactions],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add transaction',
        loading: false 
      });
    }
  },

  updateTransaction: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      const { data: updatedTransaction, error } = await supabase
        .from('transactions')
        .update({
          type: data.type,
          amount: data.amount,
          description: data.description,
          category: data.category,
          transaction_date: data.transaction_date,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        transactions: state.transactions.map(t => t.id === id ? updatedTransaction : t),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update transaction',
        loading: false 
      });
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete transaction',
        loading: false 
      });
    }
  },

  getMonthlyStats: () => {
    const { transactions, selectedMonth } = get();
    
    const monthTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(selectedMonth)
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: monthTransactions.length
    };
  },

  getCategoryStats: () => {
    const { transactions, selectedMonth, categories } = get();
    
    const monthTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(selectedMonth)
    );

    const categoryMap = new Map<string, { amount: number; count: number; color: string }>();

    monthTransactions.forEach(transaction => {
      const category = transaction.category;
      const amount = Number(transaction.amount);
      
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        const categoryData = categories.find(c => c.name === category);
        categoryMap.set(category, {
          amount,
          count: 1,
          color: categoryData?.color || '#6B7280'
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        ...data
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  clearFinance: () => set({ 
    transactions: [], 
    categories: [],
    selectedMonth: new Date().toISOString().slice(0, 7),
    selectedCategory: '', 
    selectedType: 'all',
    error: null 
  }),
}));