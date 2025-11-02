import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Users, 
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useProjectsStore } from '../../store/projectsStore';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProjectsAnalyticsProps {
  loading: boolean;
}

const ProjectsAnalytics: React.FC<ProjectsAnalyticsProps> = ({ loading }) => {
  const { analytics, projects } = useProjectsStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Dados de análise não disponíveis
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adicione alguns projetos para ver as análises.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const statusData = Object.entries(analytics.by_status || {}).map(([status, count]) => ({
    name: status,
    value: count,
    color: getStatusColor(status)
  }));

  const contractorData = Object.entries(analytics.by_contractor || {})
    .map(([contractor, data]) => ({
      name: contractor.length > 15 ? contractor.substring(0, 15) + '...' : contractor,
      fullName: contractor,
      projetos: data.count,
      valor: data.total_value,
      pago: data.total_paid,
      pendente: data.total_pending
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 8);

  const cityData = Object.entries(analytics.by_city || {})
    .map(([city, data]) => ({
      name: city.length > 12 ? city.substring(0, 12) + '...' : city,
      fullName: city,
      projetos: data.count,
      valor: data.total_value
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);

  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'iniciado':
        return '#3B82F6';
      case 'em andamento':
        return '#F59E0B';
      case 'finalizado':
        return '#10B981';
      case 'pausado':
        return '#6B7280';
      case 'cancelado':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Projetos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.total_projects}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrencyShort(analytics.total_value)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Pago
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrencyShort(analytics.total_paid)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Pendente
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrencyShort(analytics.total_pending)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Efficiency */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Eficiência de Pagamento
          </h3>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="text-2xl font-bold">{analytics.payment_efficiency}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(analytics.payment_efficiency, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Percentual do valor total que já foi pago
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição por Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(Number(percent) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contractors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Principais Contratantes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={formatCurrencyShort} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'valor' ? formatCurrency(value) : value,
                    name === 'valor' ? 'Valor Total' : 'Projetos'
                  ]}
                  labelFormatter={(label) => {
                    const item = contractorData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="valor" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cities Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Projetos por Cidade
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'projetos' ? 'Projetos' : 'Valor Total'
                  ]}
                  labelFormatter={(label) => {
                    const item = cityData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="projetos" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Análise de Pagamentos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={formatCurrencyShort} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'pago' ? 'Pago' : 'Pendente'
                  ]}
                  labelFormatter={(label) => {
                    const item = contractorData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="pago" stackId="a" fill="#10B981" />
                <Bar dataKey="pendente" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estatísticas Detalhadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Contratantes Únicos
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(analytics.by_contractor || {}).length}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Cidades Atendidas
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(analytics.by_city || {}).length}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Ticket Médio
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.total_projects > 0 
                ? formatCurrencyShort(analytics.total_value / analytics.total_projects)
                : formatCurrency(0)
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsAnalytics;