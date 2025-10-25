import React, { useState, useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import { LinkGroup, LinkGroupFormData } from '../../types';

interface LinkGroupFormProps {
  group?: LinkGroup;
  onSubmit: (data: LinkGroupFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const colorOptions = [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-500', text: 'text-blue-600' },
  { name: 'Verde', value: 'green', bg: 'bg-green-500', text: 'text-green-600' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-500', text: 'text-purple-600' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-500', text: 'text-pink-600' },
  { name: 'Amarelo', value: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-600' },
  { name: 'Vermelho', value: 'red', bg: 'bg-red-500', text: 'text-red-600' },
  { name: 'Índigo', value: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-600' },
  { name: 'Cinza', value: 'gray', bg: 'bg-gray-500', text: 'text-gray-600' }
];

export const LinkGroupForm: React.FC<LinkGroupFormProps> = ({
  group,
  onSubmit,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState<LinkGroupFormData>({
    name: '',
    description: '',
    color: 'blue'
  });

  const [errors, setErrors] = useState<Partial<LinkGroupFormData>>({});

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        color: group.color
      });
    }
  }, [group]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LinkGroupFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof LinkGroupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {group ? 'Editar Grupo' : 'Novo Grupo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Trabalho, Estudos, Entretenimento"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                errors.name
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição opcional do grupo"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Cor do Grupo
              </div>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('color', color.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${color.bg}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl transition-colors"
            >
              {loading ? 'Salvando...' : group ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};