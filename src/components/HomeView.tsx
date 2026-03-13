import { useAppStore } from '../store/useAppStore';
import logo from '../assets/logo.png';

export const HomeView = () => {
  const { openDb, recentFiles, openRecentDb, loading } = useAppStore();

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-6 animate-fade-in">
      <div className="relative mb-12 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-card p-4 flex items-center justify-center">
          <img 
            src={logo} 
            alt="SQLite GUI Logo" 
            width="128"
            height="128"
            className="w-32 h-32 object-contain rounded-lg"
          />
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-white">SQLite</span>
          <span className="text-gradient ml-3">Studio</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
          A premium, high-performance toolkit for modern database management. 
          Elegant, fast, and light.
        </p>
      </div>

      <div className="w-full grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Getting Started</h2>
          <button
            onClick={openDb}
            disabled={loading}
            className="w-full group relative p-px rounded-xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-[#020617]/90 px-6 py-5 rounded-[11px] flex items-center justify-center gap-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20"
                height="20"
                className="h-5 w-5 text-blue-400 group-hover:text-white transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="font-semibold text-white tracking-wide">Connect Database</span>
            </div>
          </button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Recent Activity</h2>
          {recentFiles.length > 0 ? (
            <div className="glass-card divide-y divide-slate-800/40 border border-slate-800/30 overflow-hidden">
              {recentFiles.slice(0, 3).map((path) => (
                <button
                  key={path}
                  onClick={() => openRecentDb(path)}
                  disabled={loading}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-all flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-900/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                      {path.split(/[\\/]/).pop()}
                    </div>
                    <div className="text-[10px] text-slate-600 truncate font-mono mt-1">
                      {path}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
              <div className="text-slate-600 text-sm">No recent activity</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
