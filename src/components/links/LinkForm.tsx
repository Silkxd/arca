import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Globe } from 'lucide-react';
import { Link, LinkGroup, LinkFormData } from '../../types';

interface LinkFormProps {
  link?: Link;
  groups: LinkGroup[];
  onSubmit: (data: LinkFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  link,
  groups,
  onSubmit,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState<LinkFormData>({
    title: '',
    url: '',
    description: '',
    group_id: ''
  });

  const [errors, setErrors] = useState<Partial<LinkFormData>>({});

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description || '',
        group_id: link.group_id
      });
    } else if (groups.length > 0) {
      setFormData(prev => ({ ...prev, group_id: groups[0].id }));
    }
  }, [link, groups]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LinkFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL é obrigatória';
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      const testUrl = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      if (!urlPattern.test(testUrl)) {
        newErrors.url = 'URL inválida';
      }
    }

    if (!formData.group_id) {
      newErrors.group_id = 'Grupo é obrigatório';
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

  const handleChange = (field: keyof LinkFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const testUrl = () => {
    if (formData.url) {
      const url = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      window.open(url, '_blank');
    }
  };

  const getSelectedGroup = () => {
    return groups.find(group => group.id === formData.group_id);
  };

  const selectedGroup = getSelectedGroup();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {link ? 'Editar Link' : 'Novo Link'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Google, GitHub, YouTube"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                errors.title
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://exemplo.com ou exemplo.com"
                className={`w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                  errors.url
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {formData.url && (
                <button
                  type="button"
                  onClick={testUrl}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                  title="Testar URL"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.url}
              </p>
            )}
          </div>

          {/* Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grupo *
            </label>
            <select
              value={formData.group_id}
              onChange={(e) => handleChange('group_id', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                errors.group_id
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <option value="">Selecione um grupo</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.group_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.group_id}
              </p>
            )}
            {selectedGroup && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className={`w-3 h-3 rounded-full bg-${selectedGroup.color}-500`} />
                {selectedGroup.name}
              </div>
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
              placeholder="Descrição opcional do link"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Preview */}
          {formData.title && formData.url && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pré-visualização:
              </p>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {formData.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {formData.url}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              {loading ? 'Salvando...' : link ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};