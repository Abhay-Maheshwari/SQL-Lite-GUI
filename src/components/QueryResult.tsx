import { useAppStore } from '../store/useAppStore';

export const QueryResult = () => {
  const { lastQueryResult } = useAppStore();

  if (!lastQueryResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-lg">
        <p className="text-sm">Run a query to see results here</p>
      </div>
    );
  }

  if (lastQueryResult.type === 'error') {
    return (
      <div className="h-full p-4 bg-red-900/10 border border-red-900/30 rounded-lg overflow-auto">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="font-semibold text-sm">Query Error</h3>
        </div>
        <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{lastQueryResult.message}</pre>
      </div>
    );
  }

  if (lastQueryResult.type === 'nonSelect') {
    return (
      <div className="h-full p-6 bg-slate-900/40 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="text-slate-200 font-semibold mb-1">Query Executed Successfully</h3>
        <p className="text-sm text-slate-400">
          {lastQueryResult.changes} rows affected.
          {lastQueryResult.lastInsertRowid !== undefined && ` Last insert ID: ${lastQueryResult.lastInsertRowid}`}
        </p>
      </div>
    );
  }

  const { columns, rows, rowCount } = lastQueryResult;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="px-6 py-4 glass border border-slate-800/60 border-b-0 rounded-t-2xl flex items-center justify-between shadow-lg">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] font-display">Results</span>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{rowCount} rows</span>
          <button
            onClick={() => window.api.exportCsv(columns, rows)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wide px-2 py-0.5 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto border border-slate-800 rounded-b-lg bg-slate-900/50">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
            <tr>
              {columns.map((column: string) => (
                <th key={column} className="px-4 py-3 font-semibold text-slate-300 whitespace-nowrap border-r border-slate-800 last:border-0">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {rows.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((column: string) => (
                  <td key={column} className="px-4 py-2 text-slate-400 whitespace-nowrap border-r border-slate-800/50 last:border-0">
                    {row[column] === null ? (
                      <span className="text-slate-600 italic text-xs">NULL</span>
                    ) : typeof row[column] === 'object' ? (
                      JSON.stringify(row[column])
                    ) : (
                      String(row[column])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
