import Database from 'better-sqlite3';

let db: Database.Database | null = null;
let currentDbPath: string | null = null;

export const openDatabase = (path: string): { success: boolean; error?: string } => {
  try {
    if (db) {
      db.close();
    }
    db = new Database(path, { fileMustExist: true });
    currentDbPath = path;
    return { success: true };
  } catch (error: any) {
    console.error('Failed to open database:', error);
    return { success: false, error: error.message };
  }
};

export const getDatabase = () => db;
export const getDbPath = () => currentDbPath;

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
    currentDbPath = null;
  }
};
