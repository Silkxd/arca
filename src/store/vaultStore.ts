import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { VaultItem, VaultItemFormData } from '../types';
import { encryptData, decryptData } from '../lib/crypto';

interface VaultStore {
  items: VaultItem[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (data: VaultItemFormData) => Promise<void>;
  updateItem: (id: string, data: Partial<VaultItemFormData>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
}

export const useVaultStore = create<VaultStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Usuário não autenticado', loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Decrypt content for text items
      const decryptedItems = await Promise.all(
        (data || []).map(async (item) => {
          if (item.type === 'text' && item.content) {
            try {
              const decryptedContent = await decryptData(item.content);
              return { ...item, content: decryptedContent };
            } catch (error) {
              console.error('Error decrypting item content:', error);
              return item;
            }
          }
          return item;
        })
      );

      set({ items: decryptedItems, loading: false });
    } catch (error: any) {
      console.error('Error fetching vault items:', error);
      set({ 
        error: error.message || 'Erro ao carregar itens do cofre',
        loading: false 
      });
    }
  },

  addItem: async (data: VaultItemFormData) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let fileUrl = null;
      let fileName = null;
      let fileType = null;
      let fileSize = null;

      // Handle file upload for documents
      if (data.type === 'document' && data.file) {
        fileUrl = await get().uploadFile(data.file);
        fileName = data.file.name;
        fileType = data.file.type;
        fileSize = data.file.size;
      }

      // Encrypt content for text items
      let encryptedContent = null;
      if (data.type === 'text' && data.content) {
        encryptedContent = await encryptData(data.content);
      }

      const itemData = {
        user_id: user.id,
        title: data.title,
        type: data.type,
        content: encryptedContent,
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        category: data.category || null,
        notes: data.notes || null,
      };

      const { data: newItem, error } = await supabase
        .from('vault_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      // Add to local state with decrypted content
      const itemToAdd = {
        ...newItem,
        content: data.content // Use original unencrypted content for display
      };

      set(state => ({
        items: [itemToAdd, ...state.items],
        loading: false
      }));

    } catch (error: any) {
      console.error('Error adding vault item:', error);
      set({ 
        error: error.message || 'Erro ao adicionar item ao cofre',
        loading: false 
      });
      throw error;
    }
  },

  updateItem: async (id: string, data: Partial<VaultItemFormData>) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let updateData: any = {
        title: data.title,
        category: data.category || null,
        notes: data.notes || null,
      };

      // Handle file upload if new file provided
      if (data.file) {
        const fileUrl = await get().uploadFile(data.file);
        updateData = {
          ...updateData,
          file_url: fileUrl,
          file_name: data.file.name,
          file_type: data.file.type,
          file_size: data.file.size,
        };
      }

      // Encrypt content if provided
      if (data.content !== undefined) {
        updateData.content = data.content ? await encryptData(data.content) : null;
      }

      const { data: updatedItem, error } = await supabase
        .from('vault_items')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...updatedItem, content: data.content || item.content }
            : item
        ),
        loading: false
      }));

    } catch (error: any) {
      console.error('Error updating vault item:', error);
      set({ 
        error: error.message || 'Erro ao atualizar item do cofre',
        loading: false 
      });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get item to delete file if exists
      const item = get().items.find(item => item.id === id);
      
      const { error } = await supabase
        .from('vault_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Delete file from storage if exists
      if (item?.file_url) {
        const fileName = item.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('vault-files')
            .remove([`${user.id}/${fileName}`]);
        }
      }

      // Update local state
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        loading: false
      }));

    } catch (error: any) {
      console.error('Error deleting vault item:', error);
      set({ 
        error: error.message || 'Erro ao excluir item do cofre',
        loading: false 
      });
      throw error;
    }
  },

  uploadFile: async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, GIF, SVG) ou PDF.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB.');
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('vault-files')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vault-files')
      .getPublicUrl(filePath);

    return publicUrl;
  },
}));