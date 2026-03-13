import Store from 'electron-store';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  recentFiles: string[];
}

const schema: any = {
  theme: {
    type: 'string',
    enum: ['light', 'dark', 'system'],
    default: 'dark',
  },
  recentFiles: {
    type: 'array',
    items: {
      type: 'string',
    },
    default: [],
  },
};

const store = new Store<Settings>({ schema }) as any;

export default store;

export const addRecentFile = (path: string) => {
  const current = store.get('recentFiles') || [];
  const filtered = current.filter((p: string) => p !== path);
  const updated = [path, ...filtered].slice(0, 10);
  store.set('recentFiles', updated);
};

export const getRecentFiles = () => store.get('recentFiles') || [];
export const getTheme = () => store.get('theme') || 'dark';
export const setTheme = (theme: 'light' | 'dark' | 'system') => store.set('theme', theme);
