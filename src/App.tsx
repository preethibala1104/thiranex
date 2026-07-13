import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, FileCode, GraduationCap, Code2, BookOpen, Layers, Settings, FileSpreadsheet } from 'lucide-react';
import ConsoleTerminal from './components/ConsoleTerminal';
import CodeViewer from './components/CodeViewer';
import DocViewer from './components/DocViewer';

export default function App() {
  const [activePanel, setActivePanel] = useState<'code' | 'docs'>('code');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Top Professional Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-inner">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  College Mini Project
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  C++ / OOP / File I/O
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                Student Management System
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Local file simulation synchronized</span>
          </div>
        </div>
      </header>

      {/* Main Responsive Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Terminal / Console Emulator (Grid col span 5) */}
        <section className="lg:col-span-5 flex flex-col h-[650px] lg:h-auto min-h-[550px]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>Interactive Program Simulation</span>
            </div>
            <span className="text-[10px] text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded font-mono font-medium">
              v1.0 (binary mode)
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ConsoleTerminal />
          </div>
        </section>

        {/* RIGHT COLUMN: Code View and Documentation Tabs (Grid col span 7) */}
        <section className="lg:col-span-7 flex flex-col h-[650px] lg:h-auto min-h-[550px]">
          {/* Tab selector */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex space-x-1 bg-slate-200/70 p-1 border border-slate-300/40 rounded-lg">
              <button
                onClick={() => setActivePanel('code')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activePanel === 'code'
                    ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Source Code (.cpp)</span>
              </button>
              <button
                onClick={() => setActivePanel('docs')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activePanel === 'docs'
                    ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Viva Prep & Docs</span>
              </button>
            </div>

            <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Project Deliverables</span>
            </div>
          </div>

          {/* Panel Display area */}
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {activePanel === 'code' ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <CodeViewer />
                </motion.div>
              ) : (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <DocViewer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* Modern footer with quick help */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Developed for Engineering students | C++ Binary Database Simulation</span>
          <div className="flex items-center space-x-4">
            <a 
              href="#terminal-container" 
              className="hover:text-slate-800 text-slate-500 transition-colors"
            >
              Interactive terminal emulator
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href="#code-viewer-container" 
              className="hover:text-slate-800 text-slate-500 transition-colors"
            >
              Copy raw source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
