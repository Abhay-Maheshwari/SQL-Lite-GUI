import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { openDatabase, getDatabase, getDbPath } from './db';
import store, { addRecentFile, getRecentFiles } from './store';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

const createMenu = () => {
  const template: any[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Database',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
             // We can trigger the IPC handler logic here or just rely on the UI button
             // For now, let's keep it simple as the UI handles it well
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  if (isDev) {
    template[2].submenu.push({ type: 'separator' }, { role: 'toggledevtools' });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const createSplashWindow = () => {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 450,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const splashPath = url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'splash.html'),
    protocol: 'file:',
    slashes: true,
  });

  splashWindow.loadURL(splashPath);
  splashWindow.once('ready-to-show', () => {
    splashWindow?.show();
  });
};

const createWindow = () => {
  createMenu();
  createSplashWindow();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(__dirname, '..', '..', 'src', 'assets', 'logo.png'),
    autoHideMenuBar: !isDev,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });

  const indexPath = url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(indexPath);

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('db:openPath', async (event, { path: dbPath }) => {
  const openResult = openDatabase(dbPath);
  if (openResult.success) {
    addRecentFile(dbPath);
    return { success: true };
  } else {
    return { success: false, error: openResult.error };
  }
});

ipcMain.handle('db:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'SQLite Databases', extensions: ['db', 'sqlite', 'sqlite3'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const dbPath = result.filePaths[0];
  const openResult = openDatabase(dbPath);

  if (openResult.success) {
    addRecentFile(dbPath);
    return { path: dbPath };
  } else {
    throw new Error(openResult.error);
  }
});

ipcMain.handle('db:getRecentFiles', async () => {
  return getRecentFiles();
});

ipcMain.handle('db:listTables', async () => {
  const db = getDatabase();
  if (!db) throw new Error('No database open');

  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  const tables = stmt.all() as { name: string }[];
  return tables.map(t => t.name);
});

ipcMain.handle('db:getRows', async (event, { table, page, pageSize }) => {
  const db = getDatabase();
  if (!db) throw new Error('No database open');

  const offset = (page - 1) * pageSize;

  // Use double quotes for table name to handle spaces/reserved words safely
  const rowsStmt = db.prepare(`SELECT * FROM "${table}" LIMIT ? OFFSET ?`);
  const rows = rowsStmt.all(pageSize, offset);

  const columns = rowsStmt.columns().map(c => c.name);

  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM "${table}"`);
  const { count } = countStmt.get() as { count: number };

  return { columns, rows, totalCount: count };
});

ipcMain.handle('db:runQuery', async (event, { sql }) => {
  const db = getDatabase();
  if (!db) throw new Error('No database open');

  try {
    const stmt = db.prepare(sql);

    if (stmt.reader) {
      const rows = stmt.all();
      const columns = stmt.columns().map(c => c.name);
      return { type: 'select', columns, rows, rowCount: rows.length };
    } else {
      const info = stmt.run();
      return {
        type: 'nonSelect',
        changes: info.changes,
        lastInsertRowid: info.lastInsertRowid
      };
    }
  } catch (err: any) {
    console.error('Query error:', err);
    return { type: 'error', message: err.message };
  }
});

ipcMain.handle('db:exportCsv', async (event, { columns, rows }) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'results.csv',
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  });

  if (result.canceled || !result.filePath) return { success: false };

  try {
    const fs = require('fs');

    // Header
    let csvContent = columns.join(',') + '\n';

    // Rows
    rows.forEach((row: any) => {
      const line = columns.map((col: string) => {
        let val = row[col];
        if (val === null || val === undefined) return '';
        val = String(val).replace(/"/g, '""'); // Escape quotes
        return `"${val}"`;
      }).join(',');
      csvContent += line + '\n';
    });

    fs.writeFileSync(result.filePath, csvContent);
    return { success: true, path: result.filePath };
  } catch (err: any) {
    console.error('Export error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('db:updateCell', async (event, { table, column, value, rowIdColumn, rowIdValue }) => {
  const db = getDatabase();
  if (!db) throw new Error('No database open');

  try {
    const sql = `UPDATE "${table}" SET "${column}" = ? WHERE "${rowIdColumn}" = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(value, rowIdValue);
    return { success: info.changes > 0 };
  } catch (err: any) {
    console.error('Update cell error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('db:getPrimaryKey', async (event, { table }) => {
  const db = getDatabase();
  if (!db) throw new Error('No database open');

  const stmt = db.prepare(`PRAGMA table_info("${table}")`);
  const columns = stmt.all() as any[];
  const pk = columns.find(c => c.pk === 1);
  return pk ? pk.name : null;
});

