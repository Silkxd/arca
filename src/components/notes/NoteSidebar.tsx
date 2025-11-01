import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Folder, Star, Menu, X, Edit2 } from 'lucide-react';
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
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  selectedGroupId,
  onSelectGroup,
  isMobileOpen,
  onMobileToggle,
  onEditGroup,
}) => {
  const { noteGroups, notes } = useNotesStore();

  // Calcular contadores
  const totalNotes = notes.length;
  const importantNotes = notes.filter(note => note.is_important).length;
  const getGroupNoteCount = (groupId: string) => 
    notes.filter(note => note.group_id === groupId).length;

  const sidebarClasses = `
    fixed lg:relative top-0 left-0 h-full bg-emerald-50 dark:bg-gray-900 border-r border-emerald-200 dark:border-gray-700
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
        <div className="flex items-center justify-between p-4 border-b border-emerald-200 dark:border-gray-700">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Notas</h2>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-800 text-emerald-700 dark:text-emerald-300 transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-800 text-emerald-700 dark:text-emerald-300 transition-colors"
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
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <FileText size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium">Todas as notas</span>
                <span className="ml-auto text-sm bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                  {totalNotes}
                </span>
              </>
            )}
          </button>

          {/* Notas Importantes */}
          <button
            onClick={() => onSelectGroup('important')}
            className={`
              w-full flex items-center px-4 py-3 text-left transition-colors
              ${selectedGroupId === 'important' 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Star size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium">Importantes</span>
                <span className="ml-auto text-sm bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  {importantNotes}
                </span>
              </>
            )}
          </button>

          {/* Separador */}
          {!isCollapsed && (
            <div className="mx-4 my-4 border-t border-emerald-200 dark:border-gray-700" />
          )}

          {/* Grupos */}
          {!isCollapsed && (
            <div className="px-4 mb-2">
              <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Grupos
              </h3>
            </div>
          )}

          {noteGroups.map((group) => (
            <div
              key={group.id}
              className={`
                group relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${selectedGroupId === group.id 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
              
              {!isCollapsed && (
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <span className="text-sm bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                    {getGroupNoteCount(group.id)}
                  </span>
                  
                  {onEditGroup && (
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
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Estado vazio para grupos */}
          {noteGroups.length === 0 && !isCollapsed && (
            <div className="px-4 py-8 text-center text-emerald-500 dark:text-emerald-400">
              <Folder size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum grupo criado</p>
            </div>
          )}
        </div>

        {/* Footer com informações */}
        {!isCollapsed && (
          <div className="border-t border-emerald-200 dark:border-gray-700 p-4">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 space-y-1">
              <div className="flex justify-between">
                <span>Total de notas:</span>
                <span className="font-medium">{totalNotes}</span>
              </div>
              <div className="flex justify-between">
                <span>Grupos:</span>
                <span className="font-medium">{noteGroups.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};