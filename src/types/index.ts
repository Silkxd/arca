// Shared types for the Arca application

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Password {
  id: string;
  user_id: string;
  title: string;
  username: string;
  encrypted_password: string;
  url?: string;
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordFormData {
  title: string;
  username: string;
  password: string;
  url?: string;
  category?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  created_at: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
}

export interface LinkGroup {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Link {
  id: string;
  group_id: string;
  title: string;
  url: string;
  description?: string;
  order_index: number;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  budget_limit?: number;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  budget_limit?: number;
}

export interface LinkGroupFormData {
  name: string;
  description?: string;
  color: string;
}

export interface LinkFormData {
  title: string;
  url: string;
  description?: string;
  group_id?: string;
}



// Vault/Cofre types
export interface VaultItem {
  id: string;
  user_id: string;
  title: string;
  type: 'document' | 'text';
  content?: string; // For text items
  file_url?: string; // For document items
  file_name?: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VaultItemFormData {
  title: string;
  type: 'document' | 'text';
  content?: string;
  file?: File;
  category?: string;
  notes?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalPasswords: number;
  totalTransactions: number;
  totalLinkGroups: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  balance: number;
}