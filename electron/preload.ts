import { contextBridge, ipcRenderer } from 'electron';

// Expose a very minimal API for now; we will extend this in later phases.
contextBridge.exposeInMainWorld('api', {
  openDb: () => ipcRenderer.invoke('db:open'),
  listTables: () => ipcRenderer.invoke('db:listTables'),
  getRows: (table: string, page: number, pageSize: number) => 
    ipcRenderer.invoke('db:getRows', { table, page, pageSize }),
  runQuery: (sql: string) => ipcRenderer.invoke('db:runQuery', { sql }),
  exportCsv: (columns: string[], rows: any[]) => ipcRenderer.invoke('db:exportCsv', { columns, rows }),
  getRecentFiles: () => ipcRenderer.invoke('db:getRecentFiles'),
  openPath: (path: string) => ipcRenderer.invoke('db:openPath', { path }),
  updateCell: (params: { table: string, column: string, value: any, rowIdColumn: string, rowIdValue: any }) => 
    ipcRenderer.invoke('db:updateCell', params),
  getPrimaryKey: (table: string) => ipcRenderer.invoke('db:getPrimaryKey', { table }),
});

