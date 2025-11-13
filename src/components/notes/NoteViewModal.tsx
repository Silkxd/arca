import React, { useEffect } from 'react';
import { X, Edit2, Star, FileText } from 'lucide-react';
import { Note, useNotesStore } from '../../store/notesStore';

interface NoteViewModalProps {
  note: Note;
  onClose: () => void;
  onEdit: (note: Note) => void;
}

export const NoteViewModal: React.FC<NoteViewModalProps> = ({
  note,
  onClose,
  onEdit
}) => {
  const { noteTables, fetchNoteTable } = useNotesStore();
  const tables = React.useMemo(() => {
    const t = noteTables ? noteTables[note.id] : undefined;
    if (t && Array.isArray(t.data) && t.data.length) {
      const cols = Array.isArray(t.columns) && t.columns.length ? t.columns : Array.from({ length: t.data[0]?.length || 0 }, (_, i) => `Col ${i+1}`)
      return [{ data: t.data, columns: cols }]
    }
    // Fallback: parse first HTML table from content
    const match = (note.content || '').match(/<table[\s\S]*?<\/table>/i)
    if (match) {
      const container = document.createElement('div')
      container.innerHTML = match[0]
      const headerCells = Array.from(container.querySelectorAll('thead th'))
      const columns = headerCells.length ? headerCells.map(th => th.textContent || '') : []
      const rows = Array.from(container.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.textContent || '')
      })
      if (rows.length) {
        const cols = columns.length ? columns : Array.from({ length: rows[0]?.length || 0 }, (_, i) => `Col ${i+1}`)
        return [{ data: rows, columns: cols }]
      }
    }
    return []
  }, [note.id, note.content, noteTables])

  useEffect(() => {
    fetchNoteTable(note.id);
  }, [note.id, fetchNoteTable]);
  const [showTable, setShowTable] = React.useState(false)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {note.title}
                </h2>
                {note.is_important && (
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {note.note_groups?.name && `Grupo: ${note.note_groups.name} • `}
                Criado em {new Date(note.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowTable(false)}
              className={`px-3 py-1.5 text-xs rounded ${!showTable ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Ver conteúdo
            </button>
            <button
              onClick={() => setShowTable(true)}
              className={`px-3 py-1.5 text-xs rounded ${showTable ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              disabled={tables.length === 0}
            >
              Ver tabela
            </button>
          </div>

          {!showTable && (
            <div className="prose max-w-none dark:prose-invert ql-snow">
              <div className="ql-editor min-h-[200px]" dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          )}

          {showTable && (
            tables.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">Nenhuma tabela na nota</p>
            ) : (
              <div className="space-y-3">
                {tables.map((tbl, idx) => (
                  <div key={idx} className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {tbl.columns.map((col, cIdx) => (
                            <th key={cIdx} className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-xs p-2">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.data.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="border border-gray-300 dark:border-gray-700 p-2 text-xs">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
