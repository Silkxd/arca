import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useProjectsStore } from '../../store/projectsStore';
import { PJProjectFormData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProjectFormProps {
  projectId?: string | null;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, onClose }) => {
  const { projects, addProject, updateProject, loading } = useProjectsStore();
  
  const [formData, setFormData] = useState<PJProjectFormData>({
    cidade: '',
    projeto: '',
    contratante: '',
    lotes: 0,
    shape: 0,
    valor: 0,
    status: 'INICIADO',
    pago: 0,
    obs: '',
  });

  const [errors, setErrors] = useState<Partial<PJProjectFormData>>({});

  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setFormData({
          cidade: project.cidade,
          projeto: project.projeto,
          contratante: project.contratante,
          lotes: project.lotes,
          shape: project.shape,
          valor: project.valor,
          status: project.status,
          pago: project.pago,
          obs: project.obs || '',
        });
      }
    }
  }, [projectId, projects]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PJProjectFormData> = {};

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.projeto.trim()) {
      newErrors.projeto = 'Nome do projeto é obrigatório';
    }

    if (!formData.contratante.trim()) {
      newErrors.contratante = 'Contratante é obrigatório';
    }

    if (formData.lotes < 0) {
      newErrors.lotes = 'Número de lotes deve ser positivo';
    }

    if (formData.shape < 0) {
      newErrors.shape = 'Shape deve ser positivo';
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (formData.pago < 0) {
      newErrors.pago = 'Valor pago deve ser positivo';
    }

    if (formData.pago > formData.valor) {
      newErrors.pago = 'Valor pago não pode ser maior que o valor total';
    }

    if (!formData.status.trim()) {
      newErrors.status = 'Status é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await addProject(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleInputChange = (field: keyof PJProjectFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const statusOptions = [
    'INICIADO',
    'EM ANDAMENTO',
    'PAUSADO',
    'FINALIZADO',
    'CANCELADO',
    'FALTA APROVAR INÍCIO'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {projectId ? 'Editar Projeto' : 'Novo Projeto'}
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade *
                </label>
                <Input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder="Digite a cidade"
                  className={errors.cidade ? 'border-red-500' : ''}
                />
                {errors.cidade && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cidade}</p>
                )}
              </div>

              {/* Projeto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Projeto *
                </label>
                <Input
                  type="text"
                  value={formData.projeto}
                  onChange={(e) => handleInputChange('projeto', e.target.value)}
                  placeholder="Nome do projeto"
                  className={errors.projeto ? 'border-red-500' : ''}
                />
                {errors.projeto && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projeto}</p>
                )}
              </div>

              {/* Contratante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contratante *
                </label>
                <Input
                  type="text"
                  value={formData.contratante}
                  onChange={(e) => handleInputChange('contratante', e.target.value)}
                  placeholder="Nome do contratante"
                  className={errors.contratante ? 'border-red-500' : ''}
                />
                {errors.contratante && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contratante}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                )}
              </div>

              {/* Lotes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lotes
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.lotes}
                  onChange={(e) => handleInputChange('lotes', parseInt(e.target.value) || 0)}
                  placeholder="Número de lotes"
                  className={errors.lotes ? 'border-red-500' : ''}
                />
                {errors.lotes && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lotes}</p>
                )}
              </div>

              {/* Shape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shape
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shape}
                  onChange={(e) => handleInputChange('shape', parseFloat(e.target.value) || 0)}
                  placeholder="Valor do shape"
                  className={errors.shape ? 'border-red-500' : ''}
                />
                {errors.shape && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shape}</p>
                )}
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Total *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                  placeholder="Valor total do projeto"
                  className={errors.valor ? 'border-red-500' : ''}
                />
                {errors.valor && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.valor}</p>
                )}
              </div>

              {/* Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Pago
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pago}
                  onChange={(e) => handleInputChange('pago', parseFloat(e.target.value) || 0)}
                  placeholder="Valor já pago"
                  className={errors.pago ? 'border-red-500' : ''}
                />
                {errors.pago && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pago}</p>
                )}
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.obs}
                onChange={(e) => handleInputChange('obs', e.target.value)}
                placeholder="Observações adicionais sobre o projeto"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Calculated Values */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valores Calculados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Valor Pendente:</span>
                  <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(formData.valor - formData.pago)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Percentual Pago:</span>
                  <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                    {formData.valor > 0 ? ((formData.pago / formData.valor) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {projectId ? 'Atualizar' : 'Criar'} Projeto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;