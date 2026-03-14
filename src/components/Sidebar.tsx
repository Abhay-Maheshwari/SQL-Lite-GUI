import { useAppStore } from '../store/useAppStore';

export const Sidebar = () => {
  const { tables, selectedTable, selectTable, currentDbPath, view, setView } = useAppStore();

  return (
    <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col transition-all duration-300">
      <div className="px-6 py-5 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight font-display text-white">SQLite Studio</h1>
        {currentDbPath && (
          <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <p className="text-[10px] text-neutral-400 truncate uppercase tracking-widest font-medium" title={currentDbPath}>
              {currentDbPath.split(/[\\/]/).pop()}
            </p>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1 border-b border-white/5">
        <button
          onClick={() => setView('home')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group ${
            view === 'home'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300'
          }`}
        >
          <div className={`p-1 rounded-md ${view === 'home' ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
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
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group ${
              view === 'query'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300'
            }`}
          >
            <div className={`p-1 rounded-md ${view === 'query' ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span className="font-medium tracking-wide">SQL Editor</span>
          </button>
        )}

        <button
          onClick={() => setView('diagram')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group ${
            view === 'diagram'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300'
          }`}
        >
          <div className={`p-1 rounded-md ${view === 'diagram' ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="font-medium tracking-wide">Structure</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {!currentDbPath ? (
          <div className="p-8 text-center mt-10">
            <p className="text-[11px] text-neutral-600 uppercase tracking-widest font-bold mb-4">No Database</p>
            <div className="w-10 h-10 rounded-full bg-neutral-900 mx-auto flex items-center justify-center border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
              </svg>
            </div>
          </div>
        ) : tables.length === 0 ? (
          <div className="p-8 text-center mt-10">
            <p className="text-[11px] text-neutral-600 uppercase tracking-widest font-bold">No tables found</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 mt-2">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tables</p>
            </div>
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => {
                  selectTable(table);
                  setView('table');
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 group flex items-center gap-3 ${
                  selectedTable === table && view === 'table'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300'
                }`}
              >
                <div className={`p-1 rounded-md ${selectedTable === table && view === 'table' ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
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
