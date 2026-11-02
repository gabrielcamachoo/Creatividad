import React, { useState, useMemo } from 'react';
import {
  UNIVERSITY_TEMPLATES,
  PUJ_FACULTIES,
  CareerOption,
  SubjectTemplate,
} from '@/config/curriculum.config';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { api } from '@/lib/api';
import {
  X,
  Search,
  GraduationCap,
  BookOpen,
  Plus,
  Check,
  Sparkles,
  Building2,
  Layers,
} from 'lucide-react';

interface JaverianaPensumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JaverianaPensumModal: React.FC<JaverianaPensumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subjects, addSubject, addTopic } = useStudyStore();
  const { userProfile, setUserProfile, setStudentLevel } = useSettingsStore();

  // Buscar la carrera actual del usuario o por defecto Ingeniería de Sistemas PUJ
  const initialCareer = useMemo(() => {
    const match = UNIVERSITY_TEMPLATES.find(
      (c) =>
        c.id !== 'personalizada' &&
        (c.name.toLowerCase() === (userProfile.careerOrGrade || '').toLowerCase() ||
          c.id === 'puj_ing_sistemas')
    );
    return match || UNIVERSITY_TEMPLATES[0];
  }, [userProfile.careerOrGrade]);

  const [selectedFaculty, setSelectedFaculty] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCareerId, setActiveCareerId] = useState<string>(initialCareer.id);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedCodes, setImportedCodes] = useState<Record<string, boolean>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  if (!isOpen) return null;

  const pujCareers = UNIVERSITY_TEMPLATES.filter((c) => c.id !== 'personalizada');

  const filteredCareers = pujCareers.filter((c) => {
    const matchesFaculty = selectedFaculty === 'Todas' || c.faculty === selectedFaculty;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.faculty.toLowerCase().includes(q) ||
      c.subjects.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.topics.some((t) => t.name.toLowerCase().includes(q))
      );
    return matchesFaculty && matchesSearch;
  });

  const activeCareer: CareerOption =
    pujCareers.find((c) => c.id === activeCareerId) ||
    filteredCareers[0] ||
    pujCareers[0];

  const isSubjectAlreadyAdded = (sub: SubjectTemplate) => {
    return (
      importedCodes[sub.code] ||
      subjects.some(
        (existing) =>
          existing.code.toUpperCase() === sub.code.toUpperCase() ||
          existing.name.toLowerCase() === sub.name.toLowerCase()
      )
    );
  };

  const handleImportSingleSubject = async (sub: SubjectTemplate) => {
    if (isSubjectAlreadyAdded(sub)) return;
    setImportingId(sub.code);
    try {
      let createdSubId = '';
      try {
        const res = await api.bulkImport({
          subjectName: sub.name,
          code: sub.code,
          colorTheme: sub.colorTheme,
          emoji: sub.emoji,
          masteredTopics: [],
          partialTopics: [],
          unknownTopics: sub.topics.map((t) => t.name),
        });
        createdSubId = res.subject?.id || res.subjectId || '';
      } catch {
        // Fallback local si está offline
      }

      const subId = addSubject(
        sub.name,
        sub.code,
        sub.colorTheme,
        sub.emoji,
        sub.summary || '',
        undefined,
        createdSubId || undefined
      );

      const today = new Date().toISOString().split('T')[0];
      sub.topics.forEach((t) => {
        addTopic(subId, t.name, today, 'red', today, t.summary || '');
      });

      setImportedCodes((prev) => ({ ...prev, [sub.code]: true }));
      setFeedbackMsg(`✅ "${sub.name}" agregada con ${sub.topics.length} temas en Rojo (por aprender).`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } finally {
      setImportingId(null);
    }
  };

  const handleImportFullCareer = async (career: CareerOption) => {
    setImportingId('ALL');
    let addedCount = 0;

    try {
      for (const sub of career.subjects) {
        if (isSubjectAlreadyAdded(sub)) continue;
        let createdSubId = '';
        try {
          const res = await api.bulkImport({
            subjectName: sub.name,
            code: sub.code,
            colorTheme: sub.colorTheme,
            emoji: sub.emoji,
            masteredTopics: [],
            partialTopics: [],
            unknownTopics: sub.topics.map((t) => t.name),
          });
          createdSubId = res.subject?.id || res.subjectId || '';
        } catch {
          // Fallback local
        }

        const subId = addSubject(
          sub.name,
          sub.code,
          sub.colorTheme,
          sub.emoji,
          sub.summary || '',
          undefined,
          createdSubId || undefined
        );

        const today = new Date().toISOString().split('T')[0];
        sub.topics.forEach((t) => {
          addTopic(subId, t.name, today, 'red', today, t.summary || '');
        });

        addedCount++;
      }

      // Actualizar carrera del estudiante a esta carrera de la Javeriana
      setStudentLevel('university');
      setUserProfile({
        studentLevel: 'university',
        careerOrGrade: `${career.name} · PUJ`,
      });
      try {
        await api.updateProfile({
          studentLevel: 'university',
          careerOrGrade: `${career.name} · PUJ`,
        });
      } catch {}

      setFeedbackMsg(
        addedCount > 0
          ? `🎓 Se cargaron ${addedCount} materias del pensum de ${career.name} (PUJ).`
          : `✨ Ya tienes todas las materias de ${career.name} en tu tablero.`
      );
      setTimeout(() => setFeedbackMsg(''), 4500);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-5xl my-auto p-5 sm:p-7 relative text-left animate-scale-up shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
          aria-label="Cerrar catálogo PUJ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex flex-wrap items-center gap-2 mb-1 pr-10">
          <span className="chip bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pontificia Universidad Javeriana · {pujCareers.length} Pregrados Oficiales</span>
          </span>
          <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
            17 Facultades
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
          Catálogo de Pensums · Universidad Javeriana 🏛️
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Explora las 47 carreras de pregrado de la Javeriana y agrega una materia individual o el pensum completo a tu tablero (todos los temas inician en 🔴 Rojo para que midas tu avance desde cero).
        </p>

        {feedbackMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Barra de búsqueda y filtro por Facultad */}
        <div className="mt-4 grid sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar carrera, materia, código o tema (ej. Sistemas, Medicina, Derecho, Cálculo...)"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="sm:col-span-5 relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                const firstInFac = pujCareers.find(
                  (c) => e.target.value === 'Todas' || c.faculty === e.target.value
                );
                if (firstInFac) setActiveCareerId(firstInFac.id);
              }}
              aria-label="Filtrar por facultad"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Todas">🏛️ Todas las Facultades ({pujCareers.length} carreras)</option>
              {PUJ_FACULTIES.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cuerpo dividido: Lista de carreras a la izquierda y Pensum detallado a la derecha */}
        <div className="mt-4 flex-1 grid md:grid-cols-12 gap-4 min-h-0 overflow-hidden">
          {/* Columna izquierda: Carreras */}
          <div className="md:col-span-5 flex flex-col min-h-0 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] font-heading font-black text-slate-500 dark:text-slate-400">
              <span>PREGRADOS ({filteredCareers.length})</span>
              <span>MATERIAS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-60 md:max-h-none">
              {filteredCareers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No se encontraron carreras con esa búsqueda.
                </div>
              ) : (
                filteredCareers.map((career) => {
                  const isSelected = activeCareer?.id === career.id;
                  return (
                    <button
                      key={career.id}
                      type="button"
                      onClick={() => setActiveCareerId(career.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border border-amber-500/40 text-slate-900 dark:text-white shadow-xs'
                          : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                          {career.emoji}
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading font-black text-xs truncate">
                            {career.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {career.faculty}
                          </p>
                        </div>
                      </div>
                      <span className="chip bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black shrink-0">
                        {career.subjects.length}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Columna derecha: Materias y Temas del Pensum seleccionado */}
          <div className="md:col-span-7 flex flex-col min-h-0 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 overflow-hidden">
            {activeCareer && (
              <>
                <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30">
                      {activeCareer.emoji}
                    </span>
                    <div>
                      <span className="text-[10px] font-heading font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        {activeCareer.faculty} · PUJ
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white">
                        {activeCareer.name}
                      </h3>
                      {activeCareer.totalCredits && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Plan oficial: ~{activeCareer.totalCredits} créditos académicos ·{' '}
                          {activeCareer.subjects.length} materias troncales listas
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={importingId === 'ALL'}
                    onClick={() => handleImportFullCareer(activeCareer)}
                    className="btn-game px-4 py-2.5 rounded-2xl text-xs font-heading font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-xs shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {importingId === 'ALL'
                        ? 'Cargando pensum...'
                        : 'Cargar todo el pensum'}
                    </span>
                  </button>
                </div>

                {/* Lista de materias del pensum */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 max-h-80 md:max-h-none">
                  {activeCareer.subjects.map((sub) => {
                    const alreadyAdded = isSubjectAlreadyAdded(sub);
                    return (
                      <div
                        key={sub.code}
                        className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center shrink-0">
                              {sub.emoji}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {sub.name}
                                </span>
                                <span className="chip bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black py-0">
                                  {sub.code}
                                </span>
                                {sub.semester && (
                                  <span className="chip bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-bold py-0">
                                    Sem. {sub.semester}
                                  </span>
                                )}
                                {sub.credits && (
                                  <span className="chip bg-sky-500/10 text-sky-600 dark:text-sky-300 text-[10px] font-bold py-0">
                                    {sub.credits} créd.
                                  </span>
                                )}
                              </div>
                              {sub.summary && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {sub.summary}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={alreadyAdded || importingId === sub.code}
                            onClick={() => handleImportSingleSubject(sub)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-heading font-black flex items-center gap-1 shrink-0 transition-all ${
                              alreadyAdded
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xs'
                            }`}
                          >
                            {alreadyAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>En tu tablero</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Agregar materia</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Chips con los temas oficiales de la materia */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sub.topics.map((t) => (
                            <span
                              key={t.name}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300"
                              title={t.summary}
                            >
                              <BookOpen className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{t.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
