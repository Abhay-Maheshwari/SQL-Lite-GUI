import { useAppStore } from '../store/useAppStore';

export const QueryResult = () => {
  const { lastQueryResult } = useAppStore();

  if (!lastQueryResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-500 bg-[#050505] border border-dashed border-white/10 rounded-lg">
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
      <div className="h-full p-6 bg-[#050505] border border-white/5 rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="text-white font-semibold mb-1">Query Executed Successfully</h3>
        <p className="text-sm text-neutral-400">
          {lastQueryResult.changes} rows affected.
          {lastQueryResult.lastInsertRowid !== undefined && ` Last insert ID: ${lastQueryResult.lastInsertRowid}`}
        </p>
      </div>
    );
  }

  const { columns, rows, rowCount } = lastQueryResult;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="px-6 py-4 glass border border-white/5 border-b-0 rounded-t-2xl flex items-center justify-between shadow-lg">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] font-display">Results</span>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">{rowCount} rows</span>
          <button
            onClick={() => window.api.exportCsv(columns, rows)}
            className="text-[10px] font-bold text-neutral-400 hover:text-white uppercase tracking-wide px-2 py-0.5 rounded border border-white/10 hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto border border-white/5 rounded-b-lg bg-[#050505]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-black border-b border-white/5 z-10">
            <tr>
              {columns.map((column: string) => (
                <th key={column} className="px-4 py-3 font-semibold text-neutral-300 whitespace-nowrap border-r border-white/5 last:border-0">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {columns.map((column: string) => (
                  <td key={column} className="px-4 py-2 text-neutral-400 whitespace-nowrap border-r border-white/5 last:border-0">
                    {row[column] === null ? (
                      <span className="text-neutral-600 italic text-xs">NULL</span>
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
