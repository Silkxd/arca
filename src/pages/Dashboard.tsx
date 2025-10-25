import React from 'react';
import { Shield, DollarSign, FileText, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArcaLogo from '../assets/Arca_logo.svg';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const arcaModules = [
    {
      id: 'finance',
      title: 'Arca Finanças',
      description: 'Controle financeiro pessoal e empresarial',
      icon: DollarSign,
      path: '/finance',
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30'
    },
    {
      id: 'vault',
      title: 'Arca Sec',
      description: 'Cofre digital para documentos e informações seguras',
      icon: Shield,
      path: '/vault',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200 dark:border-blue-800/30'
    },
    {
      id: 'notes',
      title: 'Arca Brain',
      description: 'Onde seus pensamentos ganham forma',
      icon: FileText,
      path: '/notes',
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200 dark:border-purple-800/30'
    },
    {
      id: 'foco',
      title: 'Arca Foco',
      description: 'Produtividade com objetividade em tarefas e projetos',
      icon: Target,
      path: '/foco',
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200 dark:border-orange-800/30'
    }
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="p-4 max-w-6xl mx-auto h-full flex flex-col">
        {/* Hero Section */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={ArcaLogo} 
              alt="Arca Logo" 
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Ecosistema Arca
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Centralize dados, informações e produtividade em um só lugar
          </p>
        </div>

        {/* Arca Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto flex-1">
          {arcaModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.path)}
                className={`
                  group relative overflow-hidden rounded-xl border-2 ${module.borderColor} ${module.bgColor}
                  hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer
                  bg-white dark:bg-gray-800/50 backdrop-blur-sm
                `}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative p-5">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl ${module.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${module.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {module.description}
                    </p>
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
        <div className="text-center mt-6 pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Escolha um módulo para começar sua jornada no Ecosistema Arca
          </p>
        </div>
      </div>
    </div>
  );
};