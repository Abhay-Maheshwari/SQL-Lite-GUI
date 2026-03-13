import { useAppStore } from '../store/useAppStore';

export const SchemaView = () => {
  const { selectedTable, tableSchema, loading } = useAppStore();

  if (!selectedTable) return null;

  const schema = tableSchema[selectedTable];

  if (loading && !schema) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 text-blue-500"></div>
      </div>
    );
  }

  if (!schema || schema.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 italic">
        <p>No schema information found for "{selectedTable}"</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in">
      <div className="flex-1 overflow-auto border border-slate-800 rounded-xl bg-slate-900/40 glass">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-widest text-[10px] border-r border-slate-800">PK</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-widest text-[10px] border-r border-slate-800">Name</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-widest text-[10px] border-r border-slate-800">Type</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-widest text-[10px] border-r border-slate-800">Not Null</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-widest text-[10px]">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {schema.map((col: any) => (
              <tr key={col.name} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-center border-r border-slate-800/50">
                  {col.pk ? (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold">
                      PK
                    </span>
                  ) : (
                    <span className="text-slate-700">-</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-200 border-r border-slate-800/50 group-hover:text-blue-400 transition-colors">
                  {col.name}
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-[11px] border-r border-slate-800/50">
                  {col.type}
                </td>
                <td className="px-6 py-4 text-center border-r border-slate-800/50">
                  {col.notnull ? (
                    <span className="text-red-400/80 text-[10px] font-bold">YES</span>
                  ) : (
                    <span className="text-slate-600 text-[10px]">NO</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 italic text-[11px]">
                  {col.dflt_value === null ? 'NULL' : String(col.dflt_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 bg-blue-900/10 border border-blue-900/20 rounded-lg flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p className="text-[11px] text-blue-300/80 leading-snug">
          Table schema provides structural metadata, including constraints and storage types defined in the database.
        </p>
      </div>
    </div>
  );
};
