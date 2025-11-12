import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Folder, Star, Menu, X, Edit2, Plus } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import { NoteGroup } from '../../store/notesStore';

interface NoteSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
  onEditGroup?: (group: NoteGroup) => void;
  onAddGroup?: () => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  selectedGroupId,
  onSelectGroup,
  isMobileOpen,
  onMobileToggle,
  onEditGroup,
  onAddGroup,
}) => {
  const { noteGroups } = useNotesStore();

  const sidebarClasses = `
    fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-in-out z-40
    ${isCollapsed ? 'w-16' : 'w-72'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden
    ${isMobileOpen ? 'block' : 'hidden'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <div className={overlayClasses} onClick={onMobileToggle} />
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notas</h2>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors min-w-[44px] min-h-[44px]"
          >
            <X size={22} />
          </button>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Todas as Notas */}
          <button
            onClick={() => onSelectGroup(null)}
            className={`
              w-full flex items-center px-4 py-3 text-left transition-colors
              ${selectedGroupId === null 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <FileText size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Todas as notas</span>
            )}
          </button>

          {/* Notas Importantes */}
          <button
            onClick={() => onSelectGroup('important')}
            className={`
              w-full flex items-center px-4 py-3 text-left transition-colors
              ${selectedGroupId === 'important' 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <Star size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Importantes</span>
            )}
          </button>

          {/* Separador */}
          {!isCollapsed && (
            <div className="mx-4 my-4 border-t border-gray-200 dark:border-gray-700" />
          )}

          {/* Grupos Header com botão de adicionar */}
          {!isCollapsed && (
            <div className="px-4 mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Grupos
              </h3>
              {onAddGroup && (
                <button
                  onClick={onAddGroup}
                  className="p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  title="Criar novo grupo"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          )}

          {noteGroups.map((group) => (
            <div
              key={group.id}
              className={`
                group relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${selectedGroupId === group.id 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <button
                onClick={() => onSelectGroup(group.id)}
                className="flex items-center min-w-0 flex-1 text-left"
              >
                <Folder size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span 
                    className="ml-3 font-medium truncate" 
                    title={group.name}
                  >
                    {group.name}
                  </span>
                )}
              </button>
              
              {!isCollapsed && onEditGroup && (
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGroup(group);
                    }}
                    className="
                      p-1 rounded-full transition-all duration-200
                      text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 
                      hover:bg-emerald-50 dark:hover:bg-emerald-900/30
                      opacity-0 group-hover:opacity-100
                    "
                    title="Editar grupo"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Estado vazio para grupos */}
          {noteGroups.length === 0 && !isCollapsed && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Folder size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum grupo criado</p>
              {onAddGroup && (
                <button
                  onClick={onAddGroup}
                  className="mt-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                >
                  Criar primeiro grupo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};