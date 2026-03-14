import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SchemaView } from './SchemaView';
import { Pagination } from './Pagination';

export const TableView = () => {
  const { selectedTable, tableData, loading, refreshTable, setView, setQueryText, tableMode, setTableMode, updateCell } = useAppStore();
  const [editingCell, setEditingCell] = useState<{ rowIndex: number, column: string, value: any } | null>(null);

  if (!selectedTable) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 italic animate-fade-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 opacity-20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M3 3h18v18H3zM3 9h18M9 3v18" />
        </svg>
        <p className="text-sm">Select a table from the sidebar to view data</p>
      </div>
    );
  }

  const data = tableData[selectedTable];

  if (loading && !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.rows.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-500">
        <p className="text-sm italic">No data in table "{selectedTable}"</p>
        <button
          onClick={() => refreshTable(selectedTable)}
          className="mt-4 px-4 py-2 bg-[#0a0a0a] text-neutral-300 rounded-lg text-xs font-bold border border-white/5 hover:bg-neutral-900 transition-all"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!editingCell) return;
    const { rowIndex, column, value } = editingCell;
    const success = await updateCell(selectedTable, column, value, data.rows[rowIndex]);
    if (success) {
      setEditingCell(null);
    } else {
      // Keep editing mode open or show error
      console.error('Update failed');
    }
  };

  return (
    <div className="h-full flex flex-col gap-3 animate-fade-in">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display uppercase tracking-tight">
          {selectedTable}
          <div className="flex bg-[#050505] p-1 rounded-lg border border-white/5 ml-2">
            <button
              onClick={() => setTableMode('data')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${tableMode === 'data' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              DATA
            </button>
            <button
              onClick={() => setTableMode('schema')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${tableMode === 'schema' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              SCHEMA
            </button>
          </div>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshTable(selectedTable)}
            disabled={loading}
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-white' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => {
              setQueryText(`SELECT * FROM "${selectedTable}" LIMIT 100;`);
              setView('query');
            }}
            className="text-xs font-semibold text-black bg-white hover:bg-neutral-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Editor
          </button>
          <button
            onClick={() => window.api.exportCsv(data.columns, data.rows)}
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tableMode === 'data' ? (
          <div className="h-full flex flex-col gap-3">
            <div className="flex-1 overflow-auto border border-white/5 rounded-xl bg-[#050505] glass">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 bg-black border-b border-white/5 z-10">
                  <tr>
                    {data.columns.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 font-semibold text-neutral-300 whitespace-nowrap border-r border-white/5 last:border-0"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      {data.columns.map((column) => (
                        <td
                          key={column}
                          onDoubleClick={() => setEditingCell({ rowIndex: i, column, value: row[column] })}
                          className={`px-4 py-2 text-neutral-400 whitespace-nowrap border-r border-white/5 last:border-0 min-w-[100px] ${editingCell?.rowIndex === i && editingCell?.column === column ? 'bg-white/10' : ''}`}
                        >
                          {editingCell?.rowIndex === i && editingCell?.column === column ? (
                            <input
                              autoFocus
                              className="w-full bg-black border border-white/20 rounded px-2 py-0.5 text-white outline-none"
                              value={editingCell.value === null ? '' : String(editingCell.value)}
                              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                              onBlur={handleUpdate}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdate();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                            />
                          ) : (
                            <>
                              {row[column] === null ? (
                                <span className="text-neutral-600 italic text-xs">NULL</span>
                              ) : typeof row[column] === 'object' ? (
                                JSON.stringify(row[column])
                              ) : (
                                String(row[column])
                              )}
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        ) : (
          <SchemaView />
        )}
      </div>
    </div>
  );
};
