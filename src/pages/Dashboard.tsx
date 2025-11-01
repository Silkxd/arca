import React from 'react';
import { Shield, DollarSign, FileText, Target, ArrowRight, TrendingUp, Lock, Brain, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArcaLogo from '../assets/Arca_logo.svg';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const arcaModules = [
    {
      id: 'finance',
      title: 'Arca Finanças',
      description: 'Controle financeiro pessoal e empresarial completo',
      detailedDescription: 'Gerencie suas finanças com inteligência e precisão',
      features: ['Planejamento PF/PJ', 'Controle de Gastos', 'Projetos Financeiros', 'Relatórios Detalhados'],
      icon: DollarSign,
      secondaryIcon: TrendingUp,
      path: '/finance',
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30',
      badge: 'Finanças'
    },
    {
      id: 'vault',
      title: 'Arca Sec',
      description: 'Cofre digital para documentos e informações seguras',
      detailedDescription: 'Proteja seus dados com criptografia avançada',
      features: ['Criptografia Avançada', 'Documentos Seguros', 'Backup Automático', 'Acesso Controlado'],
      icon: Shield,
      secondaryIcon: Lock,
      path: '/vault',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200 dark:border-blue-800/30',
      badge: 'Segurança'
    },
    {
      id: 'notes',
      title: 'Arca Brain',
      description: 'Onde seus pensamentos ganham forma e se organizam',
      detailedDescription: 'Organize ideias e maximize sua produtividade mental',
      features: ['Notas Inteligentes', 'Grupos Organizados', 'Busca Avançada', 'Sincronização'],
      icon: FileText,
      secondaryIcon: Brain,
      path: '/notes',
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200 dark:border-purple-800/30',
      badge: 'Produtividade'
    },
    {
      id: 'foco',
      title: 'Arca Foco',
      description: 'Produtividade com objetividade em tarefas e projetos',
      detailedDescription: 'Alcance seus objetivos com foco e determinação',
      features: ['Gestão de Tarefas', 'Objetivos SMART', 'Tracking de Progresso', 'Métricas de Performance'],
      icon: Target,
      secondaryIcon: CheckCircle,
      path: '/foco',
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200 dark:border-orange-800/30',
      badge: 'Foco'
    }
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="px-4 py-6 max-w-[95%] mx-auto h-full flex flex-col xl:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src={ArcaLogo} alt="Arca Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ecosistema Arca
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Centralize dados, informações e produtividade em um só lugar
        </p>
      </div>

      {/* Arca Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-full mx-auto flex-1">
        {arcaModules.map((module) => {
          const IconComponent = module.icon;
          const SecondaryIconComponent = module.secondaryIcon;
          return (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
              className={`
                group relative overflow-hidden rounded-xl border-2 ${module.borderColor} ${module.bgColor}
                hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer
                bg-white dark:bg-gray-800/50 backdrop-blur-sm min-h-[320px]
              `}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative p-6 h-full flex flex-col">
                {/* Header with Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex p-4 rounded-xl ${module.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${module.iconColor}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${module.bgColor} ${module.iconColor} border ${module.borderColor}`}>
                    {module.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    {module.detailedDescription}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SecondaryIconComponent className={`w-4 h-4 ${module.iconColor}`} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Principais funcionalidades:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${module.bgColor.replace('50', '200').replace('900/10', '600')}`} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex justify-end mt-4">
                  <div className={`p-2 rounded-full ${module.bgColor} group-hover:${module.bgColor.replace('50', '100')} transition-all duration-300`}>
                    <ArrowRight className={`w-4 h-4 ${module.iconColor} group-hover:translate-x-1 transition-transform duration-300`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pb-4">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Escolha um módulo para começar sua jornada no Ecosistema Arca
        </p>
      </div>
    </div>
  );
};