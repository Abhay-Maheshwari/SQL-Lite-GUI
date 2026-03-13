import { create } from 'zustand';

interface TableData {
  page: number;
  pageSize: number;
  totalCount: number;
  columns: string[];
  rows: any[];
}

interface AppState {
  currentDbPath: string | null;
  tables: string[];
  selectedTable: string | null;
  tableData: { [table: string]: TableData };
  loading: boolean;
  error: string | null;
  tableMode: 'data' | 'schema';
  tableSchema: { [table: string]: any[] };

  // Phase 2 state
  view: 'table' | 'query' | 'home';
  queryText: string;
  lastQueryResult: any | null;
  queryHistory: { id: string; sql: string; timestamp: number; success: boolean }[];
  recentFiles: string[];

  openDb: () => Promise<void>;
  openRecentDb: (path: string) => Promise<void>;
  loadTables: () => Promise<void>;
  loadRecentFiles: () => Promise<void>;
  selectTable: (table: string) => Promise<void>;
  refreshTable: (table: string) => Promise<void>;
  loadTablePage: (table: string, page: number) => Promise<void>;
  setPageSize: (table: string, pageSize: number) => Promise<void>;
  setTableMode: (mode: 'data' | 'schema') => void;
  loadSchema: (table: string) => Promise<void>;
  updateCell: (table: string, column: string, value: any, row: any) => Promise<boolean>;

  // Phase 2 actions
  setView: (view: 'table' | 'query' | 'home') => void;
  setQueryText: (text: string) => void;
  runCurrentQuery: () => Promise<void>;
  clearQueryResult: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentDbPath: null,
  tables: [],
  selectedTable: null,
  tableData: {},
  loading: false,
  error: null,
  tableMode: 'data',
  tableSchema: {},

  // Phase 2 initial state
  view: 'table',
  queryText: 'SELECT * FROM users LIMIT 10;',
  lastQueryResult: null,
  queryHistory: [],

  recentFiles: [],

  openDb: async () => {
    set({ loading: true, error: null });
    try {
      const result = await window.api.openDb();
      if (result) {
        set({ currentDbPath: result.path, selectedTable: null, tableData: {} });
        await get().loadTables();
        await get().loadRecentFiles();
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  openRecentDb: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const result = await window.api.openPath(path);
      if (result.success) {
        set({ currentDbPath: path, selectedTable: null, tableData: {}, view: 'table' });
        await get().loadTables();
        await get().loadRecentFiles();
      } else {
        set({ error: result.error || 'Failed to open database' });
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  loadRecentFiles: async () => {
    try {
      const files = await window.api.getRecentFiles();
      set({ recentFiles: files });
    } catch (err: any) {
      console.error('Failed to load recent files:', err);
    }
  },

  loadTables: async () => {
    try {
      const tables = await window.api.listTables();
      set({ tables });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  selectTable: async (table: string) => {
    set({ selectedTable: table, tableMode: 'data' });
    // Always load fresh data when a table is selected
    await get().loadTablePage(table, 1);
  },

  refreshTable: async (table: string) => {
    await get().loadTablePage(table, get().tableData[table]?.page || 1);
  },

  loadTablePage: async (table: string, page: number) => {
    set({ loading: true, error: null });
    try {
      const pageSize = get().tableData[table]?.pageSize || 50;
      const data = await window.api.getRows(table, page, pageSize);
      set((state) => ({
        tableData: {
          ...state.tableData,
          [table]: {
            ...data,
            page,
            pageSize,
          },
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  setPageSize: async (table: string, pageSize: number) => {
    set((state) => ({
      tableData: {
        ...state.tableData,
        [table]: {
          ...state.tableData[table],
          pageSize,
        },
      },
    }));
    await get().loadTablePage(table, 1);
  },
  
  setTableMode: (tableMode) => {
    set({ tableMode });
    if (tableMode === 'schema') {
      const { selectedTable } = get();
      if (selectedTable) get().loadSchema(selectedTable);
    }
  },

  loadSchema: async (table: string) => {
    set({ loading: true, error: null });
    try {
      const schema = await window.api.runQuery(`PRAGMA table_info("${table}")`);
      set((state) => ({
        tableSchema: {
          ...state.tableSchema,
          [table]: (schema.rows as any[]) || []
        }
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateCell: async (table: string, column: string, value: any, row: any) => {
    try {
      const pkColumn = await window.api.getPrimaryKey(table);
      if (!pkColumn) {
        set({ error: `Cannot update: No primary key found for table "${table}"` });
        return false;
      }

      const result = await window.api.updateCell({
        table,
        column,
        value,
        rowIdColumn: pkColumn,
        rowIdValue: row[pkColumn]
      });

      if (result.success) {
        set((state) => {
          const currentData = state.tableData[table];
          if (!currentData) return state;

          const updatedRows = currentData.rows.map(r => {
            if (r[pkColumn] === row[pkColumn]) {
              return { ...r, [column]: value };
            }
            return r;
          });

          return {
            tableData: {
              ...state.tableData,
              [table]: { ...currentData, rows: updatedRows }
            }
          };
        });
        return true;
      } else {
        set({ error: result.error || 'Failed to update cell' });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  // Phase 2 actions
  setView: (view) => set({ view }),
  setQueryText: (queryText) => set({ queryText }),
  clearQueryResult: () => set({ lastQueryResult: null }),
  runCurrentQuery: async () => {
    const { queryText } = get();
    if (!queryText.trim()) return;

    set({ loading: true, error: null });
    try {
      const result = await window.api.runQuery(queryText);
      
      // If it's a data-modifying query, clear table cache
      const upperQuery = queryText.trim().toUpperCase();
      const isModifying = upperQuery.startsWith('UPDATE') || 
                        upperQuery.startsWith('INSERT') || 
                        upperQuery.startsWith('DELETE') || 
                        upperQuery.startsWith('DROP') || 
                        upperQuery.startsWith('CREATE') || 
                        upperQuery.startsWith('ALTER');

      set((state) => ({
        lastQueryResult: result,
        // Clear all cached table data if database structure or content changed
        tableData: isModifying ? {} : state.tableData,
        queryHistory: [
          {
            id: Math.random().toString(36).substring(7),
            sql: queryText,
            timestamp: Date.now(),
            success: result.type !== 'error',
          },
          ...state.queryHistory,
        ].slice(0, 20),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
