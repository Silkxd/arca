import React, { useState } from 'react';
import { X, Upload, FileText, Image, File } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';
import { VaultItemFormData } from '../../types';

interface VaultItemFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<VaultItemFormData>;
  isEditing?: boolean;
  itemId?: string;
}

export const VaultItemForm: React.FC<VaultItemFormProps> = ({
  onClose,
  onSuccess,
  initialData,
  isEditing = false,
  itemId
}) => {
  const { addItem, updateItem, loading } = useVaultStore();
  
  const [formData, setFormData] = useState<VaultItemFormData>({
    title: initialData?.title || '',
    type: initialData?.type || 'text',
    content: initialData?.content || '',
    category: initialData?.category || '',
    notes: initialData?.notes || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Documentos Pessoais',
    'Documentos Profissionais',
    'Senhas e Acessos',
    'Certificados',
    'Fotos Importantes',
    'Outros'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (formData.type === 'text' && !formData.content?.trim()) {
      newErrors.content = 'Conteúdo é obrigatório para itens de texto';
    }

    if (formData.type === 'document' && !selectedFile && !isEditing) {
      newErrors.file = 'Arquivo é obrigatório para documentos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        file: selectedFile || undefined,
      };

      if (isEditing && itemId) {
        await updateItem(itemId, submitData);
      } else {
        await addItem(submitData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving vault item:', error);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      setErrors({ file: 'Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, GIF, SVG) ou PDF.' });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors({ file: 'Arquivo muito grande. Tamanho máximo: 10MB.' });
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, file: '' });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType === 'application/pdf') return <File className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Item' : 'Adicionar Item ao Cofre'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Item
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'text' })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                  formData.type === 'text'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Texto</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'document' })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                  formData.type === 'document'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Documento</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: CPF, Certidão de Nascimento, Senha do banco..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Content for Text Items */}
          {formData.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conteúdo *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Ex: no sistema meufoco.vercel.app meu usuário é xxxx e minha senha é xxxx"
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>
          )}

          {/* File Upload for Documents */}
          {formData.type === 'document' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Arquivo {!isEditing && '*'}
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    {getFileIcon(selectedFile.type)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Arraste um arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporte: JPEG, PNG, GIF, SVG, PDF (máx. 10MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/*,.pdf"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-3 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  Selecionar Arquivo
                </label>
              </div>
              {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Informações adicionais sobre este item..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};