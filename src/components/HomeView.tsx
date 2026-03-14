import { useAppStore } from '../store/useAppStore';
import logo from '../assets/logo.png';

export const HomeView = () => {
  const { openDb, recentFiles, openRecentDb, loading, setView } = useAppStore();

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-5xl mx-auto px-6 animate-fade-in">
      <div className="relative mb-14">
        <div className="relative p-6 flex items-center justify-center bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl">
          <img 
            src={logo} 
            alt="SQLite GUI" 
            width="128"
            height="128"
            className="w-24 h-24 object-contain opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
      </div>

      <div className="text-center space-y-6 mb-16">
        <h1 className="text-6xl font-extrabold tracking-tighter">
          <span className="text-white">SQLite</span>
          <span className="text-neutral-500 ml-4 font-light">Studio</span>
        </h1>
        <p className="text-xl text-neutral-500 max-w-xl mx-auto leading-relaxed font-light tracking-tight">
          A premium, high-performance toolkit for modern database management. 
          Stripped down to its essence. Pure black.
        </p>
      </div>

      <div className="w-full grid md:grid-cols-2 gap-12 items-start opacity-0 animate-fade-in [animation-delay:200ms]">
        <div className="space-y-8">
          <h2 className="text-[10px] font-bold text-neutral-700 uppercase tracking-[0.3em] px-1">Getting Started</h2>
          <button
            onClick={openDb}
            disabled={loading}
            className="w-full relative group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 bg-[#0a0a0a] hover:bg-neutral-900 hover:border-white/20 shadow-xl"
          >
            <div className="px-8 py-6 flex items-center justify-center gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24"
                height="24"
                className="h-6 w-6 text-neutral-500 group-hover:text-white transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-lg font-semibold text-white tracking-wide">Connect Database</span>
            </div>
          </button>
        </div>

        <div className="space-y-8">
          <h2 className="text-[10px] font-bold text-neutral-700 uppercase tracking-[0.3em] px-1">Recent Activity</h2>
          {recentFiles.length > 0 ? (
            <div className="bg-[#0a0a0a]/50 rounded-2xl border border-white/5 overflow-hidden shadow-lg">
              {recentFiles.slice(0, 3).map((path, index) => (
                <button
                  key={path}
                  onClick={() => openRecentDb(path)}
                  disabled={loading}
                  className={`w-full px-6 py-5 text-left hover:bg-neutral-900/80 transition-colors flex items-center gap-5 group ${
                    index !== 0 ? 'border-t border-white/5' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center group-hover:bg-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-neutral-400 group-hover:text-white truncate transition-colors">
                      {path.split(/[\\/]/).pop()}
                    </div>
                    <div className="text-[10px] text-neutral-700 truncate font-mono mt-1.5 uppercase tracking-tighter">
                      {path}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-[#0a0a0a]/50 rounded-2xl p-10 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
              </svg>
              <div className="text-neutral-600 text-[11px] uppercase tracking-widest font-bold">No recent activity</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
