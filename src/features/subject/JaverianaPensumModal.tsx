import React, { useState, useMemo } from 'react';
import {
  UNIVERSITY_TEMPLATES,
  PUJ_FACULTIES,
  CareerOption,
  SubjectTemplate,
} from '@/config/curriculum.config';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SubjectAcademicStatus } from '@/types';
import { soundEngine } from '@/lib/soundEffects';
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
  RotateCcw,
  CheckSquare,
  Square,
} from 'lucide-react';

interface JaverianaPensumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JaverianaPensumModal: React.FC<JaverianaPensumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subjects, addSubject, addTopic, retakeSubject, setSubjectAcademicStatus } =
    useStudyStore();
  const { userProfile, setUserProfile, setStudentLevel } = useSettingsStore();

  const initialCareer = useMemo(() => {
    const match = UNIVERSITY_TEMPLATES.find(
      (c) =>
        c.id !== 'personalizada' &&
        ((userProfile.careerOrGrade || '').toLowerCase().includes(c.name.toLowerCase()) ||
          c.id === 'puj_ing_sistemas')
    );
    return match || UNIVERSITY_TEMPLATES[0];
  }, [userProfile.careerOrGrade]);

  const [selectedFaculty, setSelectedFaculty] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCareerId, setActiveCareerId] = useState<string>(initialCareer.id);
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [importModeStatus, setImportModeStatus] = useState<SubjectAcademicStatus>('enrolled');
  const [defaultPassedGrade, setDefaultPassedGrade] = useState<string>('4.2');
  const [excludedCodes, setExcludedCodes] = useState<Record<string, boolean>>({});
  const [importingId, setImportingId] = useState<string | null>(null);
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

  const getExistingSubject = (sub: SubjectTemplate) => {
    return subjects.find(
      (existing) =>
        existing.code.toUpperCase() === sub.code.toUpperCase() ||
        existing.name.toLowerCase() === sub.name.toLowerCase()
    );
  };

  const toggleExcludeCode = (code: string) => {
    setExcludedCodes((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleImportSingleSubject = async (
    sub: SubjectTemplate,
    customStatus?: SubjectAcademicStatus
  ) => {
    const statusToUse = customStatus || importModeStatus;
    const existing = getExistingSubject(sub);

    // Si ya existe como retirada o perdida y la quiere cursar de nuevo:
    if (existing) {
      if (statusToUse === 'enrolled' && (existing.academicStatus === 'withdrawn' || existing.academicStatus === 'failed')) {
        soundEngine.playSuccessChime();
        retakeSubject(existing.id, 'keep_green');
        setFeedbackMsg(
          `🔄 ¡Re-inscrita! "${sub.name}" vuelve a estar activa en tu semestre (Intento #${(existing.attemptCount || 1) + 1}).`
        );
        setTimeout(() => setFeedbackMsg(''), 4000);
      } else if (statusToUse === 'passed' && existing.academicStatus !== 'passed') {
        soundEngine.playSuccessChime();
        const parsedGrade = Math.min(5, Math.max(3, parseFloat(defaultPassedGrade) || 4.0));
        setSubjectAcademicStatus(existing.id, 'passed', {
          finalGrade: parsedGrade,
          statusNote: 'Aprobada / Homologada',
          markAllTopicsGreen: true,
        });
        setFeedbackMsg(`✅ "${sub.name}" marcada como Aprobada (Nota ${parsedGrade.toFixed(1)}).`);
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
      return;
    }

    setImportingId(sub.code);
    try {
      const isPassed = statusToUse === 'passed';
      let createdSubId = '';
      try {
        const res = await api.bulkImport({
          subjectName: sub.name,
          code: sub.code,
          colorTheme: sub.colorTheme,
          emoji: sub.emoji,
          masteredTopics: isPassed ? sub.topics.map((t) => t.name) : [],
          partialTopics: [],
          unknownTopics: isPassed ? [] : sub.topics.map((t) => t.name),
        });
        createdSubId = res.subject?.id || res.subjectId || '';
      } catch {
        // Fallback local
      }

      const parsedGrade = isPassed
        ? Math.min(5, Math.max(3, parseFloat(defaultPassedGrade) || 4.0))
        : statusToUse === 'failed'
        ? 2.5
        : undefined;

      const subId = addSubject(
        sub.name,
        sub.code,
        sub.colorTheme,
        sub.emoji,
        sub.summary || '',
        undefined,
        createdSubId || undefined,
        {
          academicStatus: statusToUse,
          semester: sub.semester,
          credits: sub.credits ?? 3,
          finalGrade: parsedGrade,
          attemptCount: 1,
          statusNote:
            statusToUse === 'passed'
              ? 'Materia aprobada en semestres anteriores'
              : statusToUse === 'withdrawn'
              ? 'Materia retirada previamente'
              : statusToUse === 'failed'
              ? 'Materia pendiente por repetir'
              : `Semestre ${sub.semester || 1}`,
        }
      );

      const today = new Date().toISOString().split('T')[0];
      sub.topics.forEach((t) => {
        addTopic(
          subId,
          t.name,
          today,
          isPassed ? 'green' : 'red',
          today,
          t.summary || ''
        );
      });

      soundEngine.playSuccessChime();
      setFeedbackMsg(
        isPassed
          ? `✅ "${sub.name}" registrada como Materia Pasada/Aprobada (100% Verde · ${sub.credits || 3} créd.).`
          : statusToUse === 'withdrawn'
          ? `⏸️ "${sub.name}" registrada como Retirada (lista para cuando la vuelvas a ver).`
          : statusToUse === 'failed'
          ? `❌ "${sub.name}" registrada como Perdida (lista para re-inscribir en repetición).`
          : `📘 "${sub.name}" inscrita en tu semestre actual con ${sub.topics.length} temas del Syllabus.`
      );
      setTimeout(() => setFeedbackMsg(''), 4000);
    } finally {
      setImportingId(null);
    }
  };

  const availableSemesters = Array.from(
    new Set((activeCareer?.subjects || []).map((s) => s.semester || 1))
  ).sort((a, b) => a - b);

  const visibleSubjects = (activeCareer?.subjects || [])
    .filter((s) => selectedSemester === 'ALL' || (s.semester || 1) === selectedSemester)
    .sort((a, b) => (a.semester || 1) - (b.semester || 1));

  const selectedVisibleSubjects = visibleSubjects.filter((s) => !excludedCodes[s.code]);

  const handleImportSelectedBatch = async () => {
    if (!activeCareer || selectedVisibleSubjects.length === 0) return;
    setImportingId('ALL');
    let addedCount = 0;

    try {
      for (const sub of selectedVisibleSubjects) {
        const existing = getExistingSubject(sub);
        if (existing) continue;
        await handleImportSingleSubject(sub, importModeStatus);
        addedCount++;
      }

      setStudentLevel('university');
      setUserProfile({
        studentLevel: 'university',
        careerOrGrade: `${activeCareer.name} · PUJ Bogotá`,
      });
      try {
        await api.updateProfile({
          studentLevel: 'university',
          careerOrGrade: `${activeCareer.name} · PUJ Bogotá`,
        });
      } catch {}

      soundEngine.playChestFanfare();
      setFeedbackMsg(
        addedCount > 0
          ? `🎓 Se importaron ${addedCount} asignaturas seleccionadas (${
              importModeStatus === 'passed'
                ? 'como Materias Pasadas/Aprobadas ✅'
                : importModeStatus === 'withdrawn'
                ? 'como Retiradas ⏸️'
                : importModeStatus === 'failed'
                ? 'como Perdidas ❌'
                : 'como Cursando actualmente 📘'
            }).`
          : `✨ Las asignaturas seleccionadas ya estaban en tu tablero.`
      );
      setTimeout(() => setFeedbackMsg(''), 4500);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-6xl my-auto p-5 sm:p-7 relative text-left animate-scale-up shadow-2xl max-h-[94vh] flex flex-col overflow-hidden">
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
            <span>Pontificia Universidad Javeriana Sede Bogotá · Pensums & Syllabus</span>
          </span>
          <span className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            Personaliza tu semestre, homologa pasadas o re-inscribe retiradas/perdidas
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
          Armador de Semestre & Pensums Oficiales · U. Javeriana Bogotá 🏛️
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Elige un semestre, <strong>marca o desmarca qué materias estás viendo</strong> (por si adelantaste o cambiaste alguna), o regístralas como <strong>✅ Pasadas/Aprobadas</strong>, <strong>⏸️ Retiradas</strong> o <strong>❌ Perdidas</strong>.
        </p>

        {feedbackMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Barra de búsqueda, facultad y MODO DE IMPORTACIÓN ACADÉMICO */}
        <div className="mt-3.5 grid sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar carrera, materia, código o tema del syllabus..."
              className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
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
              className="w-full pl-9 pr-2 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="Todas">🏛️ Todas las Facultades</option>
              {PUJ_FACULTIES.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Estado con el que entran las materias */}
          <div className="sm:col-span-4 flex items-center gap-1.5">
            <select
              value={importModeStatus}
              onChange={(e) => setImportModeStatus(e.target.value as SubjectAcademicStatus)}
              aria-label="Estado académico al importar"
              className="flex-1 px-3 py-2 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 text-xs font-heading font-black text-slate-900 dark:text-white"
            >
              <option value="enrolled">📘 Importar como: Cursando ahora (Temas en 🔴)</option>
              <option value="passed">✅ Importar como: Materia Ya Pasada (Temas en 🟢)</option>
              <option value="withdrawn">⏸️ Importar como: Retirada a mitad de semestre</option>
              <option value="failed">❌ Importar como: Perdida (Para volver a ver)</option>
            </select>

            {importModeStatus === 'passed' && (
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="5.0"
                value={defaultPassedGrade}
                onChange={(e) => setDefaultPassedGrade(e.target.value)}
                title="Nota definitiva con la que aprobaste (3.0 a 5.0)"
                className="w-16 px-2 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-center text-xs font-black text-emerald-700 dark:text-emerald-300"
              />
            )}
          </div>
        </div>

        {/* Cuerpo dividido */}
        <div className="mt-3.5 flex-1 grid md:grid-cols-12 gap-4 min-h-0 overflow-hidden">
          {/* Columna izquierda: Carreras */}
          <div className="md:col-span-4 flex flex-col min-h-0 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] font-heading font-black text-slate-500 dark:text-slate-400">
              <span>CARRERAS PUJ BOGOTÁ ({filteredCareers.length})</span>
              <span>MATERIAS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-52 md:max-h-none">
              {filteredCareers.map((career) => {
                const isSelected = activeCareer?.id === career.id;
                return (
                  <button
                    key={career.id}
                    type="button"
                    onClick={() => {
                      setActiveCareerId(career.id);
                      setSelectedSemester('ALL');
                      setExcludedCodes({});
                    }}
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
                          Facultad de {career.faculty}
                        </p>
                      </div>
                    </div>
                    <span className="chip bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black shrink-0">
                      {career.subjects.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna derecha: Asignaturas y Selección Personalizada */}
          <div className="md:col-span-8 flex flex-col min-h-0 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 overflow-hidden">
            {activeCareer && (
              <>
                <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30">
                      {activeCareer.emoji}
                    </span>
                    <div>
                      <span className="text-[10px] font-heading font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Facultad de {activeCareer.faculty} · PUJ Sede Bogotá
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white">
                        {activeCareer.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedVisibleSubjects.length} de {visibleSubjects.length} materias marcadas para importar ·{' '}
                        {selectedVisibleSubjects.reduce((acc, s) => acc + (s.credits || 3), 0)} créditos seleccionados
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={importingId === 'ALL' || selectedVisibleSubjects.length === 0}
                    onClick={handleImportSelectedBatch}
                    className="btn-game px-4 py-2.5 rounded-2xl text-xs font-heading font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-xs shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {importingId === 'ALL'
                        ? 'Importando...'
                        : selectedSemester === 'ALL'
                        ? `Importar ${selectedVisibleSubjects.length} seleccionadas`
                        : `Importar Sem. ${selectedSemester} (${selectedVisibleSubjects.length} mat.)`}
                    </span>
                  </button>
                </div>

                {/* Barra de filtro por Semestre + Marcar/Desmarcar todas */}
                <div className="px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedSemester('ALL')}
                      className={`px-3 py-1 rounded-xl text-[11px] font-heading font-black shrink-0 transition-all ${
                        selectedSemester === 'ALL'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Todos ({activeCareer.subjects.length})
                    </button>
                    {availableSemesters.map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSelectedSemester(sem)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-heading font-black shrink-0 transition-all ${
                          selectedSemester === sem
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Sem. {sem}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const allExcluded = visibleSubjects.every((s) => excludedCodes[s.code]);
                      const next: Record<string, boolean> = { ...excludedCodes };
                      visibleSubjects.forEach((s) => {
                        next[s.code] = !allExcluded;
                      });
                      setExcludedCodes(next);
                    }}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
                  >
                    Invertir selección
                  </button>
                </div>

                {/* Lista de materias del pensum con Checkboxes e importación por estado */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 max-h-80 md:max-h-none">
                  {visibleSubjects.map((sub) => {
                    const existing = getExistingSubject(sub);
                    const isChecked = !excludedCodes[sub.code];

                    return (
                      <div
                        key={sub.code}
                        className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                          !isChecked
                            ? 'opacity-55 border-slate-200/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20'
                            : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleExcludeCode(sub.code)}
                              className="mt-1 text-amber-500 hover:scale-110 transition-transform shrink-0"
                              title={
                                isChecked
                                  ? 'Incluida en la importación del semestre (clic para quitar)'
                                  : 'Excluida de la importación (clic para incluir)'
                              }
                            >
                              {isChecked ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

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
                                {existing && (
                                  <span
                                    className={`chip text-[10px] py-0 ${
                                      existing.academicStatus === 'passed'
                                        ? 'bg-emerald-500/20 text-emerald-500'
                                        : existing.academicStatus === 'withdrawn'
                                        ? 'bg-amber-500/20 text-amber-500'
                                        : existing.academicStatus === 'failed'
                                        ? 'bg-rose-500/20 text-rose-500'
                                        : 'bg-blue-500/20 text-blue-500'
                                    }`}
                                  >
                                    {existing.academicStatus === 'passed'
                                      ? `✅ Aprobada (${existing.finalGrade?.toFixed(1) || '4.0'})`
                                      : existing.academicStatus === 'withdrawn'
                                      ? '⏸️ Retirada'
                                      : existing.academicStatus === 'failed'
                                      ? '❌ Perdida'
                                      : '📘 Cursando'}
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

                          {/* Botones rápidos por materia individual */}
                          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                            {existing ? (
                              existing.academicStatus === 'withdrawn' ||
                              existing.academicStatus === 'failed' ? (
                                <button
                                  type="button"
                                  onClick={() => handleImportSingleSubject(sub, 'enrolled')}
                                  className="px-3 py-1.5 rounded-xl text-[11px] font-heading font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Volver a ver</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-xl text-[11px] font-heading font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>En tablero</span>
                                </span>
                              )
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={importingId === sub.code}
                                  onClick={() => handleImportSingleSubject(sub, 'enrolled')}
                                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-heading font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-xs"
                                  title="Inscribir para cursar este semestre"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Cursar</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={importingId === sub.code}
                                  onClick={() => handleImportSingleSubject(sub, 'passed')}
                                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-heading font-black bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                                  title="Marcar como materia ya pasada / homologada en semestres anteriores"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Ya la pasé</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Unidades del Syllabus */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5 pl-7">
                          {sub.topics.map((t) => (
                            <span
                              key={t.name}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-[10px] text-slate-600 dark:text-slate-300"
                              title={t.summary}
                            >
                              <BookOpen className="w-2.5 h-2.5 text-rose-500 shrink-0" />
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
