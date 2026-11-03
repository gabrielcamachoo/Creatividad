import React, { useState, useEffect, useMemo } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore, AppView } from '@/store/useSettingsStore';
import { Search, X, ArrowRight, Brain, Calendar, FileText, Gift, Sparkles } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const { subjects } = useStudyStore();
  const { setActiveView, toggleDarkMode } = useSettingsStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list: Array<{
      id: string;
      type: 'action' | 'subject' | 'topic';
      title: string;
      subtitle: string;
      emoji: string;
      onSelect: () => void;
    }> = [];

    const actions: Array<{
      id: string;
      title: string;
      subtitle: string;
      emoji: string;
      view?: AppView;
      custom?: () => void;
    }> = [
      {
        id: 'act-focus',
        title: 'Abrir Sala de Enfoque, Pomodoro & Flashcards 3D',
        subtitle: 'Estudio activo con reloj Pomodoro, ruido marrón y tarjetas',
        emoji: '🧠',
        view: 'focus',
      },
      {
        id: 'act-report',
        title: 'Ver Mi Plan de Estudio Priorizado',
        subtitle: 'Algoritmo de urgencia según color de semáforo y batería',
        emoji: '🎯',
        view: 'report',
      },
      {
        id: 'act-schedule',
        title: 'Abrir Horario Semanal de Clases',
        subtitle: 'Organiza tus bloques de clase y salones',
        emoji: '📅',
        view: 'schedule',
      },
      {
        id: 'act-rewards',
        title: 'Tienda de Mascotas y Premios',
        subtitle: 'Canjea tus Voltios por mascotas y escudos de racha',
        emoji: '🦊',
        view: 'rewards',
      },
      {
        id: 'act-theme',
        title: 'Alternar Tema Oscuro / Claro',
        subtitle: 'Cambia la apariencia visual de MiSemáforo',
        emoji: '🌓',
        custom: () => toggleDarkMode(),
      },
    ];

    actions.forEach((a) => {
      if (!q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)) {
        list.push({
          id: a.id,
          type: 'action',
          title: a.title,
          subtitle: a.subtitle,
          emoji: a.emoji,
          onSelect: () => {
            if (a.custom) a.custom();
            else if (a.view) setActiveView(a.view);
            onClose();
          },
        });
      }
    });

    subjects.forEach((sub) => {
      if (!q || sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q)) {
        list.push({
          id: `sub-${sub.id}`,
          type: 'subject',
          title: sub.name,
          subtitle: `Materia (${sub.code}) · ${sub.topics.length} temas`,
          emoji: sub.emoji || '📚',
          onSelect: () => {
            setActiveView('subject', sub.id);
            onClose();
          },
        });
      }

      sub.topics.forEach((t) => {
        if (q && (t.name.toLowerCase().includes(q) || (t.summary || '').toLowerCase().includes(q))) {
          list.push({
            id: `top-${t.id}`,
            type: 'topic',
            title: t.name,
            subtitle: `Tema en ${sub.name} · ${
              t.status === 'red' ? '🔴 Rojo' : t.status === 'yellow' ? '🟡 Amarillo' : '🟢 Verde'
            }`,
            emoji: t.status === 'red' ? '🔴' : t.status === 'yellow' ? '🟡' : '🟢',
            onSelect: () => {
              setActiveView('subject', sub.id);
              onClose();
            },
          });
        }
      });
    });

    return list.slice(0, 12);
  }, [query, subjects, setActiveView, toggleDarkMode, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-up text-left">
        <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-500 shrink-0 ml-1" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca cualquier materia, tema o acción rápida..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Cerrar buscador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron materias ni temas con &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onSelect}
                className="w-full p-2.5 rounded-2xl hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 flex items-center justify-between gap-3 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-lg shrink-0">
                    {item.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-heading font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Atajo rápido: Ctrl + K</span>
          <span>ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
};
