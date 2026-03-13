import { useAppStore } from '../store/useAppStore';

export const Pagination = () => {
  const { selectedTable, tableData, loadTablePage } = useAppStore();

  if (!selectedTable) return null;

  const data = tableData[selectedTable];
  if (!data) return null;

  const { page, pageSize, totalCount } = data;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (totalPages <= 1) {
    return (
      <div className="py-3 px-4 flex items-center justify-between border-t border-slate-800 bg-slate-900/30">
        <span className="text-xs text-slate-500">
          Total rows: <span className="text-slate-300 font-medium">{totalCount}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="py-3 px-4 flex items-center justify-between border-t border-slate-800 bg-slate-900/30">
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
          <span className="text-slate-300 font-medium">
            {Math.min(page * pageSize, totalCount)}
          </span>{' '}
          of <span className="text-slate-300 font-medium">{totalCount}</span> rows
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => loadTablePage(selectedTable, page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded border border-slate-700 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          Previous
        </button>
        <span className="text-xs text-slate-500 px-2 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => loadTablePage(selectedTable, page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border border-slate-700 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
