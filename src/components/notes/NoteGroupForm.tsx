import React, { useState, useEffect } from 'react';
import { X, Folder, Trash2 } from 'lucide-react';
import { NoteGroup, NoteGroupFormData } from '../../store/notesStore';

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

interface NoteGroupFormProps {
  group?: NoteGroup;
  onSubmit: (data: NoteGroupFormData) => void;
  onClose: () => void;
  onDelete?: (groupId: string) => void;
  loading: boolean;
}

export const NoteGroupForm: React.FC<NoteGroupFormProps> = ({
  group,
  onSubmit,
  onClose,
  onDelete,
  loading
}) => {
  const [formData, setFormData] = useState<NoteGroupFormData>({
    name: '',
    color: 'blue'
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        color: group.color || 'blue'
      });
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {group ? 'Editar Grupo' : 'Novo Grupo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Grupo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do grupo"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Cor do Grupo
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700'
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
          <div className="flex items-center justify-between gap-3">
            {/* Delete button - only show when editing */}
            {group && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(group.id)}
                className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Apagar Grupo
              </button>
            ) : (
              <div></div>
            )}

            {/* Main actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                {loading ? 'Salvando...' : group ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};