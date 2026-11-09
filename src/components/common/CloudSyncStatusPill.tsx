import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Database, ShieldCheck, Download, Upload, Check, CloudOff } from 'lucide-react';
import { exportFullBackupJson, importFullBackupJson } from '@/lib/backupRestore';

export const CloudSyncStatusPill: React.FC = () => {
  const [isCloudOnline, setIsCloudOnline] = useState<boolean | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Comprobando...');

  const verifyStatus = async () => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setIsCloudOnline(false);
      setLastChecked('Sin conexión a internet');
      return;
    }
    const ok = await api.checkHealth();
    setIsCloudOnline(ok);
    const now = new Date();
    setLastChecked(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    );
  };

  useEffect(() => {
    verifyStatus();
    const interval = setInterval(verifyStatus, 30000);
    const onOnline = () => verifyStatus();
    const onOffline = () => {
      setIsCloudOnline(false);
      setLastChecked('Sin internet');
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const success = await importFullBackupJson(file);
      if (success) {
        alert('¡Copia restaurada exitosamente! La página se actualizará.');
        window.location.reload();
      } else {
        alert('Error: El archivo seleccionado no tiene un formato de respaldo válido.');
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPopover((prev) => !prev)}
        className="chip flex items-center gap-1.5 px-2.5 py-1 text-2xs font-bold transition-all bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50"
        title="Estado de sincronización y base de datos"
      >
        <span className="relative flex h-2 w-2">
          {isCloudOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          )}
        </span>
        <span className="hidden xl:inline text-slate-700 dark:text-slate-300">
          {isCloudOnline ? 'Neon Nube' : 'Local Seguro'}
        </span>
      </button>

      {/* Popover con detalles técnicos y botón de respaldo */}
      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setShowPopover(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-pop text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <span className="font-heading font-black text-xs text-slate-900 dark:text-white">
                  Estado de la Base de Datos
                </span>
              </div>
              <button
                type="button"
                onClick={() => verifyStatus()}
                className="text-2.5xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Verificar
              </button>
            </div>

            <div className="space-y-2 text-2xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Modo de sincronización:</span>
                <span className="font-bold flex items-center gap-1 text-slate-900 dark:text-white">
                  {isCloudOnline ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Nube Activa (Neon)
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Local Seguro (Offline)
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between px-2 text-slate-500 dark:text-slate-400">
                <span>Último chequeo:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {lastChecked}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-2.5xs leading-relaxed">
                {isCloudOnline
                  ? 'Tus datos se guardan en Neon PostgreSQL y en la memoria local de tu navegador.'
                  : 'Sin conexión al servidor central. Tus datos continúan guardándose en tu equipo sin pérdida.'}
              </div>
            </div>

            {/* Acciones de respaldo y restauración */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  exportFullBackupJson();
                  setShowPopover(false);
                }}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-2xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar JSON</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPopover(false);
                  handleImportClick();
                }}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-2xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
