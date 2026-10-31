import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ScheduleItem } from '@/types';
import { api } from '@/lib/api';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  MapPin,
  ArrowRight,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';

const DAYS_OF_WEEK: Array<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado'> = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const EMOJI_OPTIONS = ['📐', '🧬', '🩺', '⚖️', '💻', '🔬', '🎨', '🏛️', '📊', '🌍', '📚', '🇬🇧', '⚡', '🧪', '🎵'];

export const ScheduleScreen: React.FC = () => {
  const { schedule, subjects, addScheduleItem, deleteScheduleItem } = useStudyStore();
  const { setActiveView } = useSettingsStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [customSubjectName, setCustomSubjectName] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('📚');
  const [dayOfWeek, setDayOfWeek] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado'>('Lunes');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [room, setRoom] = useState<string>('');

  const getTodaySpanishDay = (): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  const todaySpanish = getTodaySpanishDay();
  const todayClasses = schedule
    .filter((s) => s.dayOfWeek === todaySpanish)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleSubjectSelect = (subId: string) => {
    setSelectedSubjectId(subId);
    const sub = subjects.find((s) => s.id === subId);
    if (sub) {
      setCustomSubjectName(sub.name);
      setSelectedEmoji(sub.emoji || '📚');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customSubjectName.trim();
    if (!finalName) return;

    const payload = {
      subjectId: selectedSubjectId || undefined,
      subjectName: finalName,
      subjectEmoji: selectedEmoji,
      dayOfWeek,
      startTime,
      endTime,
      room: room.trim() || 'Aula asignada',
    };

    addScheduleItem(payload);
    try {
      await api.addScheduleItem(payload);
    } catch (err) {
      console.warn('Horario guardado localmente', err);
    }

    setIsAddOpen(false);
    setCustomSubjectName('');
    setSelectedSubjectId('');
    setRoom('');
  };

  const handleDelete = async (id: string) => {
    deleteScheduleItem(id);
    try {
      await api.deleteScheduleItem(id);
    } catch {}
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-5xl mx-auto px-4 sm:px-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>Semana de Clases</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
            Tu Horario Semanal 📅
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Consulta tus aulas y sincroniza tus sesiones de estudio con tu rutina.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-game px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Agregar Clase</span>
        </button>
      </div>

      {/* Banner de "Hoy" */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-2.5xs uppercase tracking-wider backdrop-blur-xs">
                {todaySpanish}
              </span>
              <span className="text-xs text-blue-100 font-semibold">
                {todayClasses.length} {todayClasses.length === 1 ? 'clase hoy' : 'clases hoy'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-black">
              {todayClasses.length > 0
                ? `Próxima: ${todayClasses[0].subjectEmoji} ${todayClasses[0].subjectName}`
                : '¡Día despejado de clases! Aprovecha para recargar baterías'}
            </h2>
            {todayClasses.length > 0 && (
              <p className="text-xs text-blue-100 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {todayClasses[0].startTime} a {todayClasses[0].endTime}
                </span>
                {todayClasses[0].room && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {todayClasses[0].room}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          {todayClasses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {todayClasses.map((cl) => (
                <div
                  key={cl.id}
                  className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2 text-xs font-bold"
                >
                  <span className="text-sm">{cl.subjectEmoji}</span>
                  <span>{cl.startTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cuadrícula semanal (Lunes a Sábado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayItems = schedule
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const isToday = day === todaySpanish;

          return (
            <div
              key={day}
              className={`card p-4 sm:p-5 transition-all ${
                isToday
                  ? 'border-2 border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                    {day}
                  </h3>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full text-2.5xs font-black bg-blue-600 text-white animate-pulse">
                      HOY
                    </span>
                  )}
                </div>
                <span className="text-2.5xs font-bold text-slate-400">
                  {dayItems.length} {dayItems.length === 1 ? 'clase' : 'clases'}
                </span>
              </div>

              {dayItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                  Sin clases este día
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 transition-all group relative text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            {item.subjectEmoji || '📚'}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-heading font-black text-xs text-slate-900 dark:text-white truncate">
                              {item.subjectName}
                            </h4>
                            <div className="flex items-center gap-2 text-2.5xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                                <Clock className="w-3 h-3" />
                                {item.startTime} - {item.endTime}
                              </span>
                              {item.room && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 truncate max-w-[100px]">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {item.room}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                          title="Eliminar clase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.subjectId && (
                        <button
                          type="button"
                          onClick={() => setActiveView('subject', item.subjectId)}
                          className="mt-2 text-2.5xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>Ver semáforo</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Agregar Clase */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Calendar className="w-3.5 h-3.5" />
                <span>Horario</span>
              </span>
            </div>
            <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
              Nueva Clase
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Agrega una sesión a tu calendario semanal.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Seleccionar materia existente */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  ¿De qué materia es?
                </label>
                {subjects.length > 0 && (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => handleSubjectSelect(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2 font-medium"
                  >
                    <option value="">-- O elige de tus materias registradas --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.emoji || '📚'} {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex gap-2">
                  <div className="relative">
                    <span className="text-xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 inline-block">
                      {selectedEmoji}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="O escribe el nombre de la clase..."
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                {/* Emojis rápidos */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`text-sm p-1 rounded-lg border transition-transform ${
                        selectedEmoji === em
                          ? 'border-blue-500 bg-blue-500/10 scale-110'
                          : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Día (Pills) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Día de la semana
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDayOfWeek(d)}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all ${
                        dayOfWeek === d
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Aula o Enlace */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Aula / Salón / Enlace virtual (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Salón 402, Laboratorio B, Meet..."
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-game px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl"
                >
                  Guardar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
