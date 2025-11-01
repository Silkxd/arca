import React, { useState, useEffect } from 'react';
import { Building2, PieChart, Plus, Search, Filter } from 'lucide-react';
import { useProjectsStore } from '../../store/projectsStore';
import ProjectsTable from './ProjectsTable';
import ProjectsAnalytics from './ProjectsAnalytics';
import ProjectForm from './ProjectForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const ProjectsPJ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dados' | 'analises'>('dados');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  
  const {
    projects,
    loading,
    error,
    selectedStatus,
    selectedContractor,
    searchTerm,
    setSelectedStatus,
    setSelectedContractor,
    setSearchTerm,
    fetchProjects,
    fetchAnalytics,
    getStatusOptions,
    getContractorOptions,
  } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, [fetchProjects, fetchAnalytics]);

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProject(projectId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const statusOptions = getStatusOptions();
  const contractorOptions = getContractorOptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projetos - PJ
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus projetos de pessoa jurídica
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleAddProject}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dados')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dados'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Dados
          </button>
          <button
            onClick={() => setActiveTab('analises')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analises'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-2" />
            Análises
          </button>
        </nav>
      </div>

      {/* Filters - Only show on dados tab */}
      {activeTab === 'dados' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos os status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Contractor Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos os contratantes</option>
                {contractorOptions.map(contractor => (
                  <option key={contractor} value={contractor}>{contractor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'dados' ? (
          <ProjectsTable
            onEditProject={handleEditProject}
            loading={loading}
          />
        ) : (
          <ProjectsAnalytics loading={loading} />
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          projectId={editingProject}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default ProjectsPJ;