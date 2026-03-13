import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TableView } from './components/TableView';
import { Pagination } from './components/Pagination';
import { QueryEditor } from './components/QueryEditor';
import { QueryResult } from './components/QueryResult';
import { HomeView } from './components/HomeView';
import { useAppStore } from './store/useAppStore';

function App() {
  const { openDb, currentDbPath, error, loading, view, loadRecentFiles } = useAppStore();

  useEffect(() => {
    loadRecentFiles();
  }, []);

  return (
    <div className="h-screen flex bg-[#020617] text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        {error && (
          <div className="bg-red-900/20 border-b border-red-800/40 px-6 py-2 flex items-center justify-between text-xs text-red-400 animate-fade-in">
            <span>Error: {error}</span>
          </div>
        )}

        <header className="h-20 px-8 glass border-b border-white/5 flex items-center justify-between z-20 shrink-0 sticky top-0">
          <div className="flex items-center gap-6 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`h-2 w-2 rounded-full ${currentDbPath ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse' : 'bg-slate-700'}`}></div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-display">
                Connection
              </span>
            </div>
            <div className="px-3 py-1.5 bg-slate-900/40 rounded-lg border border-slate-800/50 flex items-center gap-2 max-w-[400px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="text-xs text-slate-300 truncate font-mono tracking-tight">
                {currentDbPath || 'No database connected'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </button>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <button
              onClick={openDb}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Open DB
            </button>
          </div>
        </header>

        <section className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
          {(!currentDbPath || view === 'home') ? (
            <div className="h-full flex flex-col justify-center py-10">
              <HomeView />
            </div>
          ) : view === 'table' ? (
            <TableView />
          ) : (
            <>
              <div className="h-1/2 min-h-[200px]">
                <QueryEditor />
              </div>
              <div className="flex-1 min-h-[150px]">
                <QueryResult />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

