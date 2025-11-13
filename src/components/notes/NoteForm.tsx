import React, { useState, useEffect } from 'react';
import { X, FileText, Star } from 'lucide-react';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Note, NoteGroup, NoteFormData, useNotesStore } from '../../store/notesStore';

interface NoteFormProps {
  note?: Note;
  groups: NoteGroup[];
  onSubmit: (data: NoteFormData) => void;
  onClose: () => void;
  loading: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  note,
  groups,
  onSubmit,
  onClose,
  loading
}) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    is_important: false,
    group_id: ''
  });
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<string[][]>([]);
  const tables = React.useMemo(() => {
    const matches = (formData.content || '').match(/<table[\s\S]*?<\/table>/gi) || []
    return matches
  }, [formData.content])

  const extractTableData = (html: string): string[][] => {
    if (!html) return []
    const match = html.match(/<table[\s\S]*?<\/table>/i)
    if (!match) return []
    const container = document.createElement('div')
    container.innerHTML = match[0]
    const rows = Array.from(container.querySelectorAll('tbody tr'))
    if (rows.length === 0) return []
    const data = rows.map((tr) => {
      const cells = Array.from(tr.querySelectorAll('td'))
      return cells.map((td) => td.textContent || '')
    })
    return data
  }

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        is_important: note.is_important,
        group_id: note.group_id
      });
      const { fetchNoteTable } = useNotesStore.getState();
      fetchNoteTable(note.id);
    } else if (groups.length > 0) {
      setFormData(prev => ({
        ...prev,
        group_id: groups[0].id
      }));
    }
  }, [note, groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasTableContent = tableData.some(row => row.some(cell => cell.trim() !== ''));
    if (formData.title.trim() && (formData.content.trim() || hasTableContent) && formData.group_id) {
      onSubmit({ ...formData, table_data: tableData, table_columns: formData.table_columns });
    }
  };

  const hasTableContent = tableData.some(row => row.some(cell => cell.trim() !== ''));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {note ? 'Editar Nota' : 'Nova Nota'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grupo *
              </label>
              <select
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um grupo</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da nota"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            {/* Content / Table toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conteúdo *
              </label>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setShowTable(false)}
                  className={`px-3 py-1.5 text-xs rounded ${!showTable ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  Ver conteúdo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!showTable) {
                      const { noteTables } = useNotesStore.getState();
                      const t = note && noteTables[note.id];
                      if (t && t.data?.length) {
                        setTableData(t.data.map(r => r.slice()));
                        setFormData(prev => ({ ...prev, table_columns: t.columns }));
                      } else {
                        const existing = extractTableData(formData.content)
                        if (existing.length) {
                          setTableData(existing)
                        } else {
                          setTableData(Array.from({ length: 10 }, () => Array(4).fill('')))
                        }
                      }
                    }
                    setShowTable(true)
                  }}
                  className={`px-3 py-1.5 text-xs rounded ${showTable ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  Ver tabela
                </button>
              </div>

              {!showTable && (
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Digite o conteúdo da nota..."
                    style={{
                      height: '300px',
                      backgroundColor: 'inherit'
                    }}
                  />
                </div>
              )}

              {showTable && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 overflow-x-auto">
                  <div className="min-w-[600px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {(tableData[0] || Array(4).fill('')).map((_, cIdx) => (
                            <th key={cIdx} className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-xs p-1">
                              <input
                                type="text"
                                value={(formData.table_columns && formData.table_columns[cIdx]) || `Col ${cIdx + 1}`}
                                onChange={(e) => {
                                  const val = e.target.value
                                  const cols = Array.isArray(formData.table_columns) && formData.table_columns.length ? [...formData.table_columns] : Array.from({ length: (tableData[0]?.length || 4) }, (_, i) => `Col ${i+1}`)
                                  cols[cIdx] = val
                                  setFormData(prev => ({ ...prev, table_columns: cols }))
                                }}
                                className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(tableData.length ? tableData : Array.from({ length: 10 }, () => Array(4).fill(''))).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {(row || []).map((cell, cIdx) => (
                              <td key={cIdx} className="border border-gray-300 dark:border-gray-700 p-1">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTableData(prev => {
                                      const data = prev.length ? prev.map(r => r.slice()) : Array.from({ length: 10 }, () => Array(4).fill(''));
                                      data[rIdx][cIdx] = val;
                                      if (rIdx === data.length - 1 && val.trim() !== '') {
                                        data.push(Array(data[0].length).fill(''));
                                      }
                                      if (cIdx === data[0].length - 1 && val.trim() !== '') {
                                        data.forEach(r => r.push(''));
                                      }
                                      return data;
                                    });
                                  }}
                                  className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Sync table_data into formData for saving */}
                    <div className="hidden">
                      {(() => {
                        // update formData.table_data when tableData changes
                        if (JSON.stringify(formData.table_data) !== JSON.stringify(tableData)) {
                          setFormData(prev => ({ ...prev, table_data: tableData }))
                        }
                        return null
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Important Toggle */}
            <div className="flex items-center gap-3 mt-16">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_important: !formData.is_important })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  formData.is_important
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Star className={`w-5 h-5 ${formData.is_important ? 'fill-current' : ''}`} />
                {formData.is_important ? 'Nota Importante' : 'Marcar como Importante'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.group_id || (!formData.content.trim() && !hasTableContent)}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              {loading ? 'Salvando...' : note ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
