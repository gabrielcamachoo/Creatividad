import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navegación Rápida',
      items: [
        { key: 'Ctrl + K / ⌘K', desc: 'Buscador universal de materias, temas y acciones' },
        { key: 'D', desc: 'Ir al Tablero Principal (Dashboard)' },
        { key: 'E', desc: 'Ir a Focus Arena (Modo de Estudio Pomodoro)' },
        { key: 'H', desc: 'Ir al Horario de Clases Semanal' },
        { key: 'P', desc: 'Ir a Perfil, Amigos y Duelos' },
        { key: 'M', desc: 'Ver Metodología & Certificación Científica' },
      ],
    },
    {
      category: 'En Estudio & Pomodoro',
      items: [
        { key: 'Espacio', desc: 'Iniciar / Pausar el temporizador Pomodoro' },
        { key: 'R', desc: 'Reiniciar temporizador' },
      ],
    },
    {
      category: 'Generales',
      items: [
        { key: '?', desc: 'Abrir este panel de atajos de teclado' },
        { key: 'Esc', desc: 'Cerrar cualquier ventana o modal activo' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-heading font-black text-slate-900 dark:text-white">
                Atajos de Teclado ⚡
              </h2>
              <p className="text-2.5xs text-slate-500 dark:text-slate-400">
                Acelera tu flujo de estudio sin usar el ratón
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5 max-h-[65vh] overflow-y-auto">
          {shortcuts.map((group) => (
            <div key={group.category} className="space-y-2">
              <h3 className="text-2xs font-heading font-black text-slate-400 uppercase tracking-wider">
                {group.category}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {item.desc}
                    </span>
                    <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-2.5xs font-mono font-bold text-slate-900 dark:text-slate-100 shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-2.5xs text-slate-400">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Esc</kbd> en cualquier momento para salir
          </p>
        </div>
      </div>
    </div>
  );
};
