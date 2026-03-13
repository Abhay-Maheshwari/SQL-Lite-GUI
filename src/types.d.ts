export interface Api {
  openDb: () => Promise<{ path: string } | null>;
  listTables: () => Promise<string[]>;
  getRows: (table: string, page: number, pageSize: number) => Promise<{ columns: string[]; rows: any[]; totalCount: number }>;
  runQuery: (sql: string) => Promise<{ 
    type: 'select' | 'nonSelect' | 'error'; 
    columns?: string[]; 
    rows?: any[]; 
    rowCount?: number; 
    changes?: number; 
    lastInsertRowid?: number | bigint; 
    message?: string 
  }>;
  exportCsv: (columns: string[], rows: any[]) => Promise<{ success: boolean; path?: string; error?: string }>;
  getRecentFiles: () => Promise<string[]>;
  openPath: (path: string) => Promise<{ success: boolean; error?: string }>;
  updateCell: (params: { table: string, column: string, value: any, rowIdColumn: string, rowIdValue: any }) => Promise<{ success: boolean; error?: string }>;
  getPrimaryKey: (table: string) => Promise<string | null>;
}

declare global {
  interface Window {
    api: Api;
  }
}
