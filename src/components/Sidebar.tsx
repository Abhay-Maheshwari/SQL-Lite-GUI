import { useAppStore } from '../store/useAppStore';

export const Sidebar = () => {
  const { tables, selectedTable, selectTable, currentDbPath, view, setView } = useAppStore();

  return (
    <aside className="w-64 border-r border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-xl flex flex-col transition-all duration-300">
      <div className="px-6 py-5 border-b border-slate-800/50">
        <h1 className="text-xl font-bold tracking-tight font-display text-white">SQLite Studio</h1>
        {currentDbPath && (
          <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest font-medium" title={currentDbPath}>
              {currentDbPath.split(/[\\/]/).pop()}
            </p>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1 border-b border-slate-800/30">
        <button
          onClick={() => setView('home')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group ${
            view === 'home'
              ? 'bg-blue-600/10 text-blue-400 shadow-inner border border-blue-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-md ${view === 'home' ? 'bg-blue-500/10' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="font-medium tracking-wide">Dashboard</span>
        </button>

        {currentDbPath && (
          <button
            onClick={() => setView('query')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group ${
              view === 'query'
                ? 'bg-blue-600/10 text-blue-400 shadow-inner border border-blue-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-md ${view === 'query' ? 'bg-blue-500/10' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span className="font-medium tracking-wide">SQL Editor</span>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {!currentDbPath ? (
          <div className="p-8 text-center mt-10">
            <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold mb-4">No Database</p>
            <div className="w-10 h-10 rounded-full bg-slate-900 mx-auto flex items-center justify-center border border-slate-800/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
              </svg>
            </div>
          </div>
        ) : tables.length === 0 ? (
          <div className="p-8 text-center mt-10">
            <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold">No tables found</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 mt-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tables</p>
            </div>
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => {
                  selectTable(table);
                  setView('table');
                }}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 group flex items-center gap-3 ${
                  selectedTable === table && view === 'table'
                    ? 'bg-blue-600/10 text-blue-400 shadow-inner border border-blue-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${selectedTable === table && view === 'table' ? 'bg-blue-500/10' : 'bg-slate-800/30 group-hover:bg-slate-700/50'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <span className="truncate font-medium tracking-wide">{table}</span>
              </button>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};
