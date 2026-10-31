import React from 'react';
import { useSettingsStore, StudentLevel } from '@/store/useSettingsStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useTimeStore } from '@/store/useTimeStore';
import { requestNotificationPermission, sendBrowserNotification } from '@/lib/notifications';
import { api } from '@/lib/api';
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  School,
  GraduationCap,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    setNotificationsEnabled,
    reminderTime,
    setReminderTime,
    showPresentationDock,
    togglePresentationDock,
    setIsTutorialOpen,
    studentLevel,
    setStudentLevel,
  } = useSettingsStore();

  const { isStreakPaused, toggleStreakPause, loadDemoProfile, resetGamification } =
    useGamificationStore();
  const { loadDemoSubjects, resetAllSubjects } = useStudyStore();
  const { resetTime } = useTimeStore();

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        sendBrowserNotification('¡Recordatorios activados en MiSemaforo!', {
          body: 'Te avisaremos a la hora seleccionada para mantener tus baterías de frescura.',
        });
      } else {
        alert('Para activar notificaciones debes conceder permisos en tu navegador.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleSelectLevel = async (level: StudentLevel) => {
    setStudentLevel(level);
    try {
      await api.updateLevel(level);
    } catch {}
  };

  const handleSeedLevelData = async (level: StudentLevel) => {
    setStudentLevel(level);
    try {
      await api.seedData(level);
    } catch {}
    if (level === 'school') {
      alert('Se cargaron materias de ejemplo para Colegio (Trigonometría, Química, Biología).');
    } else {
      loadDemoSubjects();
      alert('Se cargaron materias de ejemplo para Universidad (Física, Cálculo, Programación).');
    }
  };

  const handleResetTotal = () => {
    if (confirm('¿Eliminar todos los datos y reiniciar la aplicación a cero?')) {
      resetAllSubjects();
      resetGamification();
      resetTime();
      alert('Tablero reiniciado.');
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-3xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in text-left">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Settings className="w-3.5 h-3.5 text-emerald-500" />
            <span>Configuración</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
          Ajustes de MiSemaforo ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Personaliza tu etapa académica (Colegio o Universidad), sonidos y avisos.
        </p>
      </div>

      <div className="space-y-4">
        {/* Selector Colegio vs Universidad */}
        <div className="card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                Etapa Académica
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adapta las materias sugeridas y el reporte de priorización.
              </p>
            </div>
            <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-heading font-black text-xs">
              {studentLevel === 'school' ? '🏫 Bachillerato' : '🎓 Universidad'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleSelectLevel('school')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                studentLevel === 'school'
                  ? 'border-2 border-blue-500 bg-blue-500/10 ring-4 ring-blue-500/15'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 dark:text-white block">
                  Colegio / Bachillerato
                </span>
                <p className="text-2.5xs text-slate-500 mt-0.5 leading-snug">
                  Grados 6° a 11°. Enfoque en materias escolares, quizzes y recuperaciones.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectLevel('university')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                studentLevel === 'university'
                  ? 'border-2 border-purple-500 bg-purple-500/10 ring-4 ring-purple-500/15'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 dark:text-white block">
                  Universidad / Pregrado
                </span>
                <p className="text-2.5xs text-slate-500 mt-0.5 leading-snug">
                  Facultades y carreras. Enfoque en parciales semestrales y créditos.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Pausa Ética de Vacaciones */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              {isStreakPaused ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white">
                Pausa de Vacaciones
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Congela tu racha sin perder escudos mientras descansas o viajas.
              </p>
            </div>
          </div>

          <button
            onClick={toggleStreakPause}
            className={`btn-game px-4 py-2 rounded-xl text-xs font-heading font-black shrink-0 ${
              isStreakPaused
                ? 'bg-amber-500 text-white shadow-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isStreakPaused ? 'Pausa Activa ❄️' : 'Pausar Racha'}
          </button>
        </div>

        {/* Notificaciones Web */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white">
                Recordatorios Diarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aviso a la hora que elijas para evitar que tus baterías pierdan carga.
              </p>
              {notificationsEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2.5xs text-slate-400 font-bold">Hora:</span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleToggleNotifications}
            className={`btn-game px-4 py-2 rounded-xl text-xs font-heading font-black shrink-0 ${
              notificationsEnabled
                ? 'bg-blue-600 text-white shadow-blue-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {notificationsEnabled ? 'Activadas ✓' : 'Activar'}
          </button>
        </div>

        {/* Sonidos */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white">
                Efectos de Sonido
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sonidos sutiles al repasar o desbloquear recompensas.
              </p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`btn-game px-4 py-2 rounded-xl text-xs font-heading font-black shrink-0 ${
              soundEnabled
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {soundEnabled ? 'Encendido 🔊' : 'Apagado 🔇'}
          </button>
        </div>

        {/* Gestión de Datos */}
        <div className="card p-5 border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-black text-sm text-rose-600 dark:text-rose-400">
              Datos de Demostración & Reinicio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Carga materias de ejemplo o reinicia tu tablero local a cero.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSeedLevelData('school')}
              className="btn-game px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              Ejemplos Colegio
            </button>
            <button
              onClick={() => handleSeedLevelData('university')}
              className="btn-game px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              Ejemplos U
            </button>
            <button
              onClick={handleResetTotal}
              className="btn-game px-3 py-1.5 rounded-xl text-xs font-heading font-black bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30"
            >
              Borrar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
