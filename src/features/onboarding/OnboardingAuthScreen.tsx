import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import {
  SCHOOL_TEMPLATES,
  UNIVERSITY_TEMPLATES,
  PUJ_FACULTIES,
  ANIMAL_COMPANIONS,
} from '@/config/curriculum.config';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  User,
  School,
  GraduationCap,
  Camera,
  CheckCircle2,
  Moon,
  Sun,
  BookOpen,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const OnboardingAuthScreen: React.FC = () => {
  const {
    hasSeenOnboardingTutorial,
    setHasSeenOnboardingTutorial,
    setIsAuthenticated,
    setStudentLevel,
    setUserProfile,
    setActiveView,
    isDarkMode,
    toggleDarkMode,
  } = useSettingsStore();

  const {
    resetAllSubjects,
    setSubjectsList,
    setSchedule,
    setFriends,
    addSubject,
    addTopic,
    loadDemoSubjects,
  } = useStudyStore();
  const { resetGamification, equipAnimal, loadDemoProfile } = useGamificationStore();
  const { resetTime } = useTimeStore();

  // Fase 1: 'tutorial' -> Fase 2: 'auth'
  const [phase, setPhase] = useState<'tutorial' | 'auth'>(
    hasSeenOnboardingTutorial ? 'auth' : 'tutorial'
  );
  const [step, setStep] = useState(0);

  // Estado del formulario de Autenticación (por defecto en Registro para nuevos usuarios)
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<'school' | 'university'>('university');
  const [selectedSchoolGrade, setSelectedSchoolGrade] = useState('school_10_11');
  const [selectedCareer, setSelectedCareer] = useState('puj_ing_sistemas');
  const [customCareer, setCustomCareer] = useState('');
  const [loadPujPensum, setLoadPujPensum] = useState(true);
  const [chosenAnimal, setChosenAnimal] = useState('owl');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const slides = [
    {
      badge: 'Paso 1 de 4 · Tu Tablero Inteligente',
      shortTitle: 'Semáforo',
      title: 'Clasifica tus temas con el Semáforo 🚦',
      subtitle: 'Sin textos largos. Un solo toque para saber qué estudiar hoy:',
      emoji: '🚦',
      accent: 'from-rose-500/20 via-amber-500/15 to-emerald-500/20',
      content: (
        <div className="grid gap-3 text-left">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3.5 hover:scale-[1.01] transition-transform">
            <span className="w-11 h-11 rounded-2xl bg-rose-500/20 grid place-items-center text-2xl shrink-0">
              🔴
            </span>
            <div>
              <p className="font-heading font-black text-sm text-rose-600 dark:text-rose-400">
                Rojo · Por aprender (Prioridad #1)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Temas con vacíos o dudas fuertes. Tu plan los coloca de primeros.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3.5 hover:scale-[1.01] transition-transform">
            <span className="w-11 h-11 rounded-2xl bg-amber-500/20 grid place-items-center text-2xl shrink-0">
              🟡
            </span>
            <div>
              <p className="font-heading font-black text-sm text-amber-600 dark:text-amber-400">
                Amarillo · Por practicar (Prioridad #2)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Entiendes la teoría, pero necesitas resolver ejercicios sin mirar apuntes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3.5 hover:scale-[1.01] transition-transform">
            <span className="w-11 h-11 rounded-2xl bg-emerald-500/20 grid place-items-center text-2xl shrink-0">
              🟢
            </span>
            <div>
              <p className="font-heading font-black text-sm text-emerald-600 dark:text-emerald-400">
                Verde · Dominado (Mantenimiento)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Lo sabes explicar y resolver. Solo cuida que su batería no se descargue.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Paso 2 de 4 · Contra la Curva del Olvido',
      shortTitle: 'Batería 7d',
      title: 'Batería de Frescura de 7 Días 🔋',
      subtitle: 'Lo que no repasas se olvida. Tu batería te avisa a tiempo:',
      emoji: '🔋',
      accent: 'from-emerald-500/20 via-teal-500/15 to-sky-500/20',
      content: (
        <div className="space-y-3.5 text-left">
          <div className="p-5 rounded-3xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-200">
                Carga de memoria (3 bloques)
              </span>
              <span className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-2.5xs font-black">
                ⚡ 3/3 Fresco
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 h-4">
              <div className="rounded-lg bg-emerald-500 shadow-xs" />
              <div className="rounded-lg bg-emerald-500 shadow-xs" />
              <div className="rounded-lg bg-emerald-500 shadow-xs" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cada <strong>7 días sin repasar</strong> un tema, su batería pierde 1 bloque. Si llega a{' '}
              <strong className="text-rose-500">0 bloques</strong>, entra en alerta de olvido.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-sm">
              60s
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              Usa el botón <strong>"Repasé hoy"</strong> o el reto rápido <strong>"Explica en 60s"</strong> para recargar la batería al 100%.
            </p>
          </div>
        </div>
      ),
    },
    {
      badge: 'Paso 3 de 4 · Recompensas y Mascotas',
      shortTitle: 'Mascotas',
      title: 'Sube de Nivel y Adopta Mascotas 🦊',
      subtitle: 'Cada repaso real te da XP, Voltios ⚡ y desbloquea compañeros:',
      emoji: '🏆',
      accent: 'from-amber-500/20 via-orange-500/15 to-yellow-500/20',
      content: (
        <div className="space-y-3.5 text-left">
          <div className="grid grid-cols-5 gap-2 p-4 rounded-3xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            {[
              { e: '🦉', n: 'Búho' },
              { e: '🦊', n: 'Zorro' },
              { e: '🐱', n: 'Gato' },
              { e: '🐶', n: 'Perro' },
              { e: '🐲', n: 'Dragón' },
            ].map((p) => (
              <div
                key={p.n}
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 hover:-translate-y-1 transition-transform"
              >
                <span className="text-2xl sm:text-3xl block">{p.e}</span>
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 mt-1 block">
                  {p.n}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <p className="font-heading font-black text-amber-600 dark:text-amber-400">
                🔥 Racha + Escudos
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Mantén tu racha diaria y protégela con escudos o pausa de vacaciones.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25">
              <p className="font-heading font-black text-sky-600 dark:text-sky-400">
                ⚡ Tienda de Voltios
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Canjea los Voltios que ganas estudiando por mascotas, accesorios y cofres.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Paso 4 de 4 · Tu Espacio 100% Personalizado',
      shortTitle: 'Tu Espacio',
      title: 'Empieza Desde Cero a Tu Medida 🚀',
      subtitle: 'Sin datos de relleno: tú creas tus materias, tu horario y tus amigos.',
      emoji: '✨',
      accent: 'from-violet-500/20 via-indigo-500/15 to-blue-500/20',
      content: (
        <div className="space-y-3 text-left text-xs">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-2xl bg-blue-500/20 grid place-items-center text-2xl shrink-0">
              📚
            </span>
            <div>
              <p className="font-heading font-black text-sm text-blue-600 dark:text-blue-400">
                Tus Materias y Horario Semanal
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Registra únicamente las materias que estás cursando en el colegio o la universidad y arma tu horario limpio.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-2xl bg-violet-500/20 grid place-items-center text-2xl shrink-0">
              👥
            </span>
            <div>
              <p className="font-heading font-black text-sm text-violet-600 dark:text-violet-400">
                Liga Real con tus Amigos
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Agrega a tus compañeros por correo para enviarse energía (+5 Voltios) y competir en la tabla semanal.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Soporte de teclado (Flechas Izquierda / Derecha) durante el tutorial
  useEffect(() => {
    if (phase !== 'tutorial') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && step < slides.length - 1) setStep((s) => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, step, slides.length]);

  const handleFinishTutorial = () => {
    setHasSeenOnboardingTutorial(true);
    setPhase('auth');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La foto debe ser menor a 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const careerOrGradeName =
          stage === 'school'
            ? SCHOOL_TEMPLATES.find((g) => g.id === selectedSchoolGrade)?.name || 'Bachillerato'
            : selectedCareer === 'personalizada' && customCareer.trim()
            ? customCareer.trim()
            : UNIVERSITY_TEMPLATES.find((c) => c.id === selectedCareer)?.name || 'Universidad';

        const res = await api.register({
          email: email.trim(),
          password,
          name: name.trim(),
          studentLevel: stage,
          careerOrGrade: careerOrGradeName,
          photoUrl,
          equippedAnimal: chosenAnimal,
        });

        localStorage.setItem('misemaforo_token', res.token);

        // Empezar 100% desde cero sin datos falsos
        resetAllSubjects();
        resetGamification();
        resetTime();
        equipAnimal(chosenAnimal);

        // Si el usuario es de Universidad Javeriana y activó cargar su pensum base (en Rojo 0%)
        if (stage === 'university' && loadPujPensum && selectedCareer !== 'personalizada') {
          const careerObj = UNIVERSITY_TEMPLATES.find((c) => c.id === selectedCareer);
          if (careerObj && careerObj.subjects.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            for (const sub of careerObj.subjects) {
              let createdSubId = '';
              try {
                const bulkRes = await api.bulkImport({
                  subjectName: sub.name,
                  code: sub.code,
                  colorTheme: sub.colorTheme,
                  emoji: sub.emoji,
                  masteredTopics: [],
                  partialTopics: [],
                  unknownTopics: sub.topics.map((t) => t.name),
                });
                createdSubId = bulkRes.subject?.id || bulkRes.subjectId || '';
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
              sub.topics.forEach((t) => {
                addTopic(subId, t.name, today, 'red', today, t.summary || '');
              });
            }
          }
        }

        setStudentLevel(stage);
        setUserProfile({
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          studentLevel: stage,
          photoUrl: res.user.photo_url || photoUrl,
          careerOrGrade: careerOrGradeName,
          equippedAnimal: chosenAnimal,
          equippedAccessory: 'none',
        });

        setHasSeenOnboardingTutorial(true);
        setIsAuthenticated(true);
        setActiveView('dashboard');
      } else {
        const res = await api.login(email.trim(), password);
        localStorage.setItem('misemaforo_token', res.token);

        resetAllSubjects();
        resetGamification();
        resetTime();

        const level = res.user.student_level === 'school' ? 'school' : 'university';
        setStudentLevel(level);
        setUserProfile({
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          studentLevel: level,
          photoUrl: res.user.photo_url || '',
          careerOrGrade: res.user.career_or_grade || '',
          equippedAnimal: res.user.equipped_animal || 'owl',
          equippedAccessory: res.user.equipped_accessory || 'none',
        });
        if (res.user.equipped_animal) {
          equipAnimal(res.user.equipped_animal);
        }

        // Hidratar materias, horario y amigos reales guardados en la base de datos
        try {
          const [remoteSubjects, remoteSchedule, remoteFriends] = await Promise.all([
            api.getSubjects(),
            api.getSchedule(),
            api.getFriends(),
          ]);
          setSubjectsList(remoteSubjects);
          setSchedule(remoteSchedule);
          setFriends(remoteFriends);
        } catch {
          // Si no hay datos previos, se mantiene vacío desde cero
        }

        setHasSeenOnboardingTutorial(true);
        setIsAuthenticated(true);
        setActiveView('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loadDemoSubjects();
    loadDemoProfile();
    resetTime();
    setStudentLevel('university');
    setUserProfile({
      name: 'Estudiante Javeriano',
      careerOrGrade: 'Ingeniería de Sistemas · PUJ Bogotá',
      studentLevel: 'university',
      equippedAnimal: 'condor',
    });
    setHasSeenOnboardingTutorial(true);
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const selectedPetObj =
    ANIMAL_COMPANIONS.find((p) => p.id === chosenAnimal) || ANIMAL_COMPANIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b16] text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Fondos luminosos decorativos */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />

      {/* Barra superior minimalista */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-amber-400 to-rose-500 grid place-items-center text-xl shadow-pop-sm">
            🚦
          </span>
          <div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white leading-none block">
              Mi<span className="text-emerald-500">Semáforo</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              Colegio & Universidad
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {phase === 'tutorial' ? (
            <button
              type="button"
              onClick={handleFinishTutorial}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              Ir a Registro / Login →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setPhase('tutorial');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver tutorial</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickDemo}
            className="btn-game px-3.5 py-1.5 rounded-xl text-xs font-heading font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-glow"
            title="Explorar la plataforma inmediatamente con datos del pensum Javeriana"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>⚡ Modo Demo (1 Clic)</span>
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10"
            title="Cambiar tema"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        {phase === 'tutorial' ? (
          /* FASE 1: TUTORIAL INTERACTIVO DE BIENVENIDA */
          <div className="w-full max-w-xl space-y-4 animate-scale-up">
            {/* Stepper superior interactivo */}
            <div className="grid grid-cols-4 gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.shortTitle}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    idx === step
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : idx < step
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600/80 dark:text-emerald-400/80'
                      : 'border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <span className="text-base block">{s.emoji}</span>
                  <span className="text-[10px] font-heading font-black block truncate mt-0.5">
                    {idx + 1}. {s.shortTitle}
                  </span>
                </button>
              ))}
            </div>

            <div className="card p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden">
              <div
                className={`pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${slides[step].accent} blur-3xl`}
              />

              <div className="relative flex items-center justify-between gap-2 mb-3">
                <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slides[step].badge}</span>
                </span>
                <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
                  {slides[step].emoji}
                </span>
              </div>

              <h1 className="relative text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                {slides[step].title}
              </h1>
              <p className="relative text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
                {slides[step].subtitle}
              </p>

              <div className="relative min-h-[250px] flex flex-col justify-center mb-6">
                {slides[step].content}
              </div>

              {/* Controles del carrusel */}
              <div className="relative flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStep(idx)}
                      aria-label={`Ir al paso ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === step
                          ? 'w-8 bg-emerald-500'
                          : 'w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-game px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                  )}

                  {step < slides.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="btn-game px-6 py-2.5 rounded-2xl text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-400"
                    >
                      <span>Siguiente</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishTutorial}
                      className="btn-game px-6 py-3 rounded-2xl text-xs sm:text-sm font-heading font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-glow"
                    >
                      <span>¡Crear mi cuenta y empezar!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FASE 2: PANTALLA PROFESIONAL DE REGISTRO E INICIO DE SESIÓN */
          <div className="card w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-scale-up text-left">
            {/* Selector de pestañas: Crear Cuenta vs Iniciar Sesión */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 mb-5">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className={`py-2.5 rounded-xl text-xs font-heading font-black transition-all ${
                  isRegister
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ✨ Crear Cuenta Nueva
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className={`py-2.5 rounded-xl text-xs font-heading font-black transition-all ${
                  !isRegister
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔑 Ya tengo cuenta
              </button>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                {isRegister ? 'Crea tu cuenta en MiSemáforo 🚦' : 'Bienvenido de nuevo 👋'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRegister
                  ? 'Configura tu perfil desde cero y elige tu compañero de estudio.'
                  : 'Ingresa con tu correo y contraseña para cargar tu progreso.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
              {isRegister && (
                <>
                  {/* Foto de perfil opcional */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                        Foto de perfil (opcional)
                      </span>
                      <label className="text-2.5xs text-emerald-600 dark:text-emerald-400 font-black cursor-pointer hover:underline">
                        Subir imagen desde tu dispositivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Ej. Valentina Gómez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Etapa académica */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      ¿Dónde estudias actualmente?
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setStage('school')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          stage === 'school'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <School className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <span className="font-heading font-black text-xs block">Colegio</span>
                          <span className="text-[10px] text-slate-400">Bachillerato</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStage('university')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          stage === 'university'
                            ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <GraduationCap className="w-5 h-5 text-purple-500 shrink-0" />
                        <div>
                          <span className="font-heading font-black text-xs block">Universidad</span>
                          <span className="text-[10px] text-slate-400">Pregrado</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Grado o Carrera */}
                  {stage === 'school' ? (
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Grado escolar
                      </label>
                      <select
                        value={selectedSchoolGrade}
                        onChange={(e) => setSelectedSchoolGrade(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      >
                        {SCHOOL_TEMPLATES.map((tmpl) => (
                          <option key={tmpl.id} value={tmpl.id}>
                            {tmpl.emoji} {tmpl.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Carrera · Pontificia Universidad Javeriana (47 Pregrados)
                      </label>
                      <select
                        value={selectedCareer}
                        onChange={(e) => setSelectedCareer(e.target.value)}
                        aria-label="Selecciona tu carrera universitaria"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      >
                        {PUJ_FACULTIES.map((faculty) => (
                          <optgroup key={faculty} label={`🏛️ Facultad de ${faculty} (PUJ)`}>
                            {UNIVERSITY_TEMPLATES.filter((c) => c.faculty === faculty).map(
                              (tmpl) => (
                                <option key={tmpl.id} value={tmpl.id}>
                                  {tmpl.emoji} {tmpl.name}
                                </option>
                              )
                            )}
                          </optgroup>
                        ))}
                        <optgroup label="✨ Otra Carrera / Personalizada">
                          {UNIVERSITY_TEMPLATES.filter((c) => c.id === 'personalizada').map(
                            (tmpl) => (
                              <option key={tmpl.id} value={tmpl.id}>
                                {tmpl.emoji} {tmpl.name}
                              </option>
                            )
                          )}
                        </optgroup>
                      </select>

                      {selectedCareer === 'personalizada' ? (
                        <input
                          type="text"
                          placeholder="Escribe el nombre de tu carrera..."
                          value={customCareer}
                          onChange={(e) => setCustomCareer(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                          required
                        />
                      ) : (
                        <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={loadPujPensum}
                            onChange={(e) => setLoadPujPensum(e.target.checked)}
                            className="mt-0.5 rounded border-amber-500 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-[11px] text-slate-700 dark:text-slate-200 leading-snug">
                            <strong>Cargar materias del pensum PUJ:</strong> incluye las asignaturas troncales de tu carrera en{' '}
                            <strong className="text-rose-500">🔴 Rojo (0% avance)</strong>, o desmarca para iniciar el tablero vacío.
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Mascota Inicial con vista previa de su habilidad */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Elige tu compañero inicial
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {ANIMAL_COMPANIONS.slice(0, 4).map((pet) => (
                        <button
                          key={pet.id}
                          type="button"
                          onClick={() => setChosenAnimal(pet.id)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            chosenAnimal === pet.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 scale-[1.03]'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl block mb-0.5">{pet.emoji}</span>
                          <span className="font-heading font-black text-[11px] block">
                            {pet.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedPetObj && (
                      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>
                          <strong>{selectedPetObj.name}:</strong> {selectedPetObj.bonus} · {selectedPetObj.description}
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Correo */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="tu-correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Contraseña con botón mostrar/ocultar */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 4 caracteres"
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Tu tablero iniciará <strong>100% limpio desde cero</strong> para que agregues tus propias materias y clases.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-game w-full py-3.5 mt-2 rounded-2xl text-xs sm:text-sm font-heading font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-glow flex items-center justify-center gap-2"
              >
                <span>
                  {loading
                    ? 'Conectando con MiSemáforo...'
                    : isRegister
                    ? 'Registrarme y Abrir mi Tablero'
                    : 'Iniciar Sesión'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-500/40 text-xs font-heading font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Probar Modo Demo Inmediato (Sin Registro)</span>
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tus materias y avances se guardan de forma segura en tu cuenta.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
