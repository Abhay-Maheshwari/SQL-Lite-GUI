import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useAppStore } from '../store/useAppStore';

export const QueryEditor = () => {
  const { queryText, setQueryText, runCurrentQuery, loading } = useAppStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      runCurrentQuery();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border border-white/5 rounded-lg overflow-hidden" onKeyDown={handleKeyDown}>
      <div className="px-4 py-2 bg-black border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">SQL Editor</span>
        <button
          onClick={runCurrentQuery}
          disabled={loading || !queryText.trim()}
          className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-black rounded text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run Query <span className="text-[10px] opacity-60 ml-1 font-normal">(Ctrl+Enter)</span>
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-black">
        <CodeMirror
          value={queryText}
          height="100%"
          theme={oneDark}
          extensions={[sql()]}
          onChange={(value) => setQueryText(value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
          className="text-sm"
        />
      </div>
    </div>
  );
};
