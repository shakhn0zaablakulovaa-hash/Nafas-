import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Brain, Hexagon, Palette, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

// --- Neyroneka Game ---
const Neyroneka = () => {
  const [nodes, setNodes] = useState<{ id: number; x: number; y: number; connected: boolean }[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  const initGame = () => {
    const newNodes = [
      { id: 1, x: 50, y: 50, connected: false },
      { id: 2, x: 250, y: 50, connected: false },
      { id: 3, x: 150, y: 150, connected: false },
      { id: 4, x: 50, y: 250, connected: false },
      { id: 5, x: 250, y: 250, connected: false },
    ];
    setNodes(newNodes);
    setConnections([]);
    setSelectedNode(null);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleNodeClick = (id: number) => {
    if (won) return;
    if (selectedNode === null) {
      setSelectedNode(id);
    } else if (selectedNode === id) {
      setSelectedNode(null);
    } else {
      // Check if connection already exists
      const exists = connections.find(c => (c[0] === selectedNode && c[1] === id) || (c[0] === id && c[1] === selectedNode));
      if (!exists) {
        setConnections([...connections, [selectedNode, id]]);
      }
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    if (connections.length === 5) { // Simple win condition for demo
      setWon(true);
    }
  }, [connections]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-on-surface">Neyroneka</h3>
        <p className="text-sm text-on-surface-variant">Nuqtalarni birlashtirib neyron bog'lanishlar hosil qiling.</p>
      </div>

      <div className="relative w-[300px] h-[300px] bg-surface-container-high rounded-3xl mx-auto overflow-hidden border border-outline-variant/20 shadow-inner">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(([id1, id2], i) => {
            const n1 = nodes.find(n => n.id === id1)!;
            const n2 = nodes.find(n => n.id === id2)!;
            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/40"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            style={{ left: node.x - 15, top: node.y - 15 }}
            className={cn(
              "absolute w-8 h-8 rounded-full border-4 transition-all duration-300 flex items-center justify-center font-bold text-xs",
              selectedNode === node.id ? "bg-primary text-white border-primary-container scale-125 shadow-lg" : "bg-white border-outline-variant text-on-surface-variant hover:border-primary"
            )}
          >
            {node.id}
          </button>
        ))}

        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center text-white space-y-4 p-6 text-center"
            >
              <CheckCircle2 size={64} />
              <h4 className="text-2xl font-bold">Ajoyib!</h4>
              <p>Siz stressni yengishda birinchi qadamni qo'ydingiz.</p>
              <button onClick={initGame} className="px-6 py-2 bg-white text-primary rounded-full font-bold">Qayta boshlash</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <button onClick={initGame} className="flex items-center gap-2 text-primary font-bold hover:underline">
          <RotateCcw size={18} /> Tozalash
        </button>
      </div>
    </div>
  );
};

// --- Hex Game ---
const HexGame = () => {
  const [grid, setGrid] = useState<boolean[]>(Array(19).fill(false));
  
  const toggleHex = (i: number) => {
    const newGrid = [...grid];
    newGrid[i] = !newGrid[i];
    setGrid(newGrid);
  };

  const reset = () => setGrid(Array(19).fill(false));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-on-surface">Hex Puzzle</h3>
        <p className="text-sm text-on-surface-variant">Geksagonlarni yoqib o'zingizga yoqqan shaklni hosil qiling.</p>
      </div>

      <div className="flex justify-center py-8">
        <div className="grid grid-cols-5 gap-2 w-fit">
          {grid.map((active, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleHex(i)}
              className={cn(
                "w-12 h-14 transition-all duration-300",
                active ? "text-secondary" : "text-surface-container-highest hover:text-secondary/30"
              )}
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                backgroundColor: 'currentColor'
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={reset} className="flex items-center gap-2 text-secondary font-bold hover:underline">
          <RotateCcw size={18} /> Tozalash
        </button>
      </div>
    </div>
  );
};

// --- Paint Color Game ---
const PaintColor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#745286');
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = ['#745286', '#84505f', '#685b62', '#ac3149', '#4a6572', '#344955'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-on-surface">Ranglar jilosi</h3>
        <p className="text-sm text-on-surface-variant">Erkin rasm chizib stressdan xalos bo'ling.</p>
      </div>

      <div className="flex gap-2 justify-center">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all",
              color === c ? "scale-125 border-on-surface shadow-lg" : "border-transparent"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl mx-auto border border-outline-variant/20 shadow-inner overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full cursor-crosshair"
        />
      </div>

      <div className="flex justify-center">
        <button onClick={clear} className="flex items-center gap-2 text-primary font-bold hover:underline">
          <RotateCcw size={18} /> Tozalash
        </button>
      </div>
    </div>
  );
};

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<'menu' | 'neyroneka' | 'hex' | 'paint'>('menu');

  const games = [
    { id: 'neyroneka', title: 'Neyroneka', icon: Brain, color: 'bg-primary/10 text-primary', desc: 'Neyron bog\'lanishlar' },
    { id: 'hex', title: 'Hex Puzzle', icon: Hexagon, color: 'bg-secondary/10 text-secondary', desc: 'Geksagonal shakllar' },
    { id: 'paint', title: 'Ranglar jilosi', icon: Palette, color: 'bg-tertiary/10 text-tertiary', desc: 'Erkin rasm chizish' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32">
      <AnimatePresence mode="wait">
        {activeGame === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                <Gamepad2 size={16} />
                <span>Antistress o'yinlar</span>
              </div>
              <h1 className="text-4xl font-bold text-on-surface leading-tight">
                Stress va depressiyani <br />
                <span className="text-primary italic">o'yin orqali</span> yengamiz
              </h1>
              <p className="text-on-surface-variant max-w-xl text-lg">
                Ushbu o'yinlar diqqatni jamlash va ruhiy xotirjamlikka erishish uchun maxsus tanlangan.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id as any)}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 space-y-4 hover:scale-[1.02] transition-all text-left group"
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", game.color)}>
                    <game.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">{game.title}</h2>
                    <p className="text-sm text-on-surface-variant">{game.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <button
              onClick={() => setActiveGame('menu')}
              className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} /> Orqaga qaytish
            </button>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-outline-variant/10">
              {activeGame === 'neyroneka' && <Neyroneka />}
              {activeGame === 'hex' && <HexGame />}
              {activeGame === 'paint' && <PaintColor />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
