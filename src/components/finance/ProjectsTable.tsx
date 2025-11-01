import React, { useState } from 'react';
import { Edit2, Trash2, Eye, MapPin, Building, User } from 'lucide-react';
import { useProjectsStore } from '../../store/projectsStore';
import { PJProject } from '../../types';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface ProjectsTableProps {
  onEditProject: (projectId: string) => void;
  loading: boolean;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ onEditProject, loading }) => {
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<PJProject | null>(null);
  
  const { getFilteredProjects, deleteProject } = useProjectsStore();
  
  const projects = getFilteredProjects();

  const handleDeleteProject = async () => {
    if (deleteProjectId) {
      await deleteProject(deleteProjectId);
      setDeleteProjectId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'iniciado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'em andamento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'finalizado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pausado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Nenhum projeto encontrado
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comece criando seu primeiro projeto PJ.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contratante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lotes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shape
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pendente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {project.cidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {project.projeto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {project.contratante}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {project.lotes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {project.shape.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(project.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                    {formatCurrency(project.pago)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                    {formatCurrency(project.pendente)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewProject(project)}
                        className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProject(project.id)}
                        className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteProjectId(project.id)}
                        className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{project.projeto}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.cidade}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4 mr-1" />
                    Contratante
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.contratante}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Lotes</div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.lotes}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Valor</div>
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(project.valor)}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Shape</div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.shape.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Pago</div>
                  <div className="font-medium text-green-600 dark:text-green-400">{formatCurrency(project.pago)}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Pendente</div>
                  <div className="font-medium text-red-600 dark:text-red-400">{formatCurrency(project.pendente)}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewProject(project)}
                  className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProject(project.id)}
                  className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteProjectId(project.id)}
                  className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProjectId && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setDeleteProjectId(null)}
          onConfirm={handleDeleteProject}
          title="Excluir Projeto"
          message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      )}

      {/* View Project Modal */}
      {viewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalhes do Projeto
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewProject(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Projeto
                  </label>
                  <p className="text-gray-900 dark:text-white">{viewProject.projeto}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <p className="text-gray-900 dark:text-white">{viewProject.cidade}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contratante
                  </label>
                  <p className="text-gray-900 dark:text-white">{viewProject.contratante}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewProject.status)}`}>
                    {viewProject.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lotes
                  </label>
                  <p className="text-gray-900 dark:text-white">{viewProject.lotes}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shape
                  </label>
                  <p className="text-gray-900 dark:text-white">{viewProject.shape.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Total
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(viewProject.valor)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Pago
                  </label>
                  <p className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(viewProject.pago)}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Pendente
                  </label>
                  <p className="text-red-600 dark:text-red-400 font-medium">{formatCurrency(viewProject.pendente)}</p>
                </div>

                {viewProject.obs && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observações
                    </label>
                    <p className="text-gray-900 dark:text-white">{viewProject.obs}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsTable;