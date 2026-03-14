import { useRef, useEffect, useState } from 'react';

interface Column {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
  x: number;
  y: number;
}

const INITIAL_TABLES: Table[] = [
  {
    id: 'reviews',
    name: 'Reviews',
    x: 50,
    y: 100,
    columns: [
      { name: 'review_id', type: 'INT', isPk: true },
      { name: 'user_id', type: 'INT', isFk: true },
      { name: 'movie_id', type: 'INT', isFk: true },
      { name: 'rating', type: 'INT' },
      { name: 'comment', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME' },
    ],
  },
  {
    id: 'movies',
    name: 'Movies',
    x: 400,
    y: 100,
    columns: [
      { name: 'movie_id', type: 'INT', isPk: true },
      { name: 'title', type: 'VARCHAR(100)' },
      { name: 'release_year', type: 'INT' },
      { name: 'duration_min', type: 'INT' },
    ],
  },
  {
    id: 'genres',
    name: 'Genres',
    x: 750,
    y: 100,
    columns: [
      { name: 'genre_id', type: 'INT', isPk: true },
      { name: 'name', type: 'VARCHAR(100)' },
    ],
  },
  {
    id: 'users',
    name: 'Users',
    x: 50,
    y: 450,
    columns: [
      { name: 'user_id', type: 'INT', isPk: true },
      { name: 'user_name', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'created_at', type: 'DATETIME' },
    ],
  },
  {
    id: 'actors',
    name: 'Actors',
    x: 400,
    y: 450,
    columns: [
      { name: 'actor_id', type: 'INT', isPk: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'birth_year', type: 'INT' },
      { name: 'country_id', type: 'INT' },
    ],
  },
  {
    id: 'moviegenres',
    name: 'MovieGenres',
    x: 750,
    y: 450,
    columns: [
      { name: 'movie_id', type: 'INT', isFk: true },
      { name: 'genre_id', type: 'INT', isFk: true },
    ],
  },
];

const RELATIONSHIPS = [
  { from: 'reviews', to: 'users' },
  { from: 'reviews', to: 'movies' },
  { from: 'moviegenres', to: 'movies' },
  { from: 'moviegenres', to: 'genres' },
];

export function DiagramView() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const next = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(next, 0.2), 2);
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.min(Math.max(prev + delta, 0.2), 2));
    }
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;
    // Account for scale when dragging
    setDragging({ id, startX: (e.clientX / scale) - table.x, startY: (e.clientY / scale) - table.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setTables(prev => prev.map(t => 
        t.id === dragging.id 
          ? { ...t, x: (e.clientX / scale) - dragging.startX, y: (e.clientY / scale) - dragging.startY }
          : t
      ));
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, scale]);

  const getTablePos = (id: string) => {
    const t = tables.find(tbl => tbl.id === id);
    return t ? { x: t.x, y: t.y } : { x: 0, y: 0 };
  };

  return (
    <div 
      className="flex-1 relative bg-black select-none overflow-hidden" 
      ref={containerRef}
      onWheel={handleWheel}
    >
      {/* Zoom Controls */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-50">
        <button 
          onClick={() => handleZoom('in')}
          className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-neutral-800 transition-colors shadow-2xl"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button 
          onClick={() => setScale(1)}
          className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-neutral-800 transition-colors shadow-2xl text-[10px] font-bold"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button 
          onClick={() => handleZoom('out')}
          className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-neutral-800 transition-colors shadow-2xl"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>



      {/* Scalable Content Area */}
      <div 
        className="h-full w-full overflow-auto scrollbar-hide"
        style={{ cursor: dragging ? 'grabbing' : 'default' }}
      >
        <div 
          className="relative transition-transform duration-75 origin-top-left p-[200px]"
          style={{ 
            transform: `scale(${scale})`,
            minWidth: '2000px',
            minHeight: '1500px'
          }}
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
              </marker>
            </defs>
            {RELATIONSHIPS.map((rel, idx) => {
              const from = getTablePos(rel.from);
              const to = getTablePos(rel.to);
              
              const w = 240;
              const h = 200;

              let startX, startY, endX, endY;

              if (from.x + w < to.x) {
                  startX = from.x + w;
                  startY = from.y + 100;
                  endX = to.x;
                  endY = to.y + 100;
              } else if (from.x > to.x + w) {
                  startX = from.x;
                  startY = from.y + 100;
                  endX = to.x + w;
                  endY = to.y + 100;
              } else if (from.y + h < to.y) {
                  startX = from.x + 120;
                  startY = from.y + h;
                  endX = to.x + 120;
                  endY = to.y;
              } else {
                  startX = from.x + 120;
                  startY = from.y;
                  endX = to.x + 120;
                  endY = to.y + h;
              }

              return (
                <path
                  key={idx}
                  d={`M ${startX} ${startY} C ${startX + (endX - startX) / 2} ${startY}, ${startX + (endX - startX) / 2} ${endY}, ${endX} ${endY}`}
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                  className="opacity-20 transition-opacity hover:opacity-100"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {tables.map((table) => (
            <div
              key={table.id}
              style={{ left: table.x, top: table.y }}
              onMouseDown={(e) => handleMouseDown(table.id, e)}
              className={`absolute w-[240px] bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-3xl overflow-hidden group hover:border-white/30 transition-shadow ${dragging?.id === table.id ? 'z-50 ring-2 ring-white/20' : ''} cursor-grab`}
            >
              <div className="bg-white/5 px-5 py-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-[11px] font-black text-white tracking-[0.3em] uppercase">{table.name}</span>
              </div>
              <div className="p-4 space-y-1.5">
                {table.columns.map((col) => (
                  <div key={col.name} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/5 transition-colors group/col">
                    <div className="flex items-center gap-3">
                      {col.isPk ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                      ) : col.isFk ? (
                        <svg className="w-3 h-3 text-neutral-400 group-hover/col:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5"></div>
                      )}
                      <span className={`text-[10px] font-bold tracking-tight ${col.isPk || col.isFk ? 'text-white' : 'text-neutral-500'}`}>
                        {col.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-700 tracking-tighter uppercase">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
