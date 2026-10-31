import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { SCHOOL_TEMPLATES, UNIVERSITY_TEMPLATES, ANIMAL_COMPANIONS } from '@/config/curriculum.config';
import { X, Lock, Mail, User, Sparkles, Check, ArrowRight, School, GraduationCap, Camera } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<'school' | 'university'>('school');
  const [selectedSchoolGrade, setSelectedSchoolGrade] = useState('school_10_11');
  const [selectedCareer, setSelectedCareer] = useState('sistemas');
  const [customCareer, setCustomCareer] = useState('');
  const [chosenAnimal, setChosenAnimal] = useState('owl');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    setStudentLevel,
    setUserProfile,
    setIsTutorialOpen,
    setIsMotivationOpen,
  } = useSettingsStore();
  const { loadCurriculumTemplate } = useStudyStore();
  const { equipAnimal } = useGamificationStore();

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
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

        setStudentLevel(stage);
        setUserProfile({
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          studentLevel: stage,
          photoUrl: res.user.photo_url || photoUrl,
          careerOrGrade: careerOrGradeName,
          equippedAnimal: chosenAnimal,
        });
        equipAnimal(chosenAnimal);

        if (stage === 'school') {
          const tmpl = SCHOOL_TEMPLATES.find((g) => g.id === selectedSchoolGrade);
          if (tmpl) loadCurriculumTemplate(tmpl.subjects);
        } else {
          const tmpl = UNIVERSITY_TEMPLATES.find((c) => c.id === selectedCareer);
          if (tmpl && tmpl.subjects.length > 0) loadCurriculumTemplate(tmpl.subjects);
        }

        onSuccess(res.user);
        onClose();
        setIsTutorialOpen(true);
      } else {
        const res = await api.login(email.trim(), password);
        localStorage.setItem('misemaforo_token', res.token);
        setUserProfile({
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          studentLevel: res.user.student_level,
          photoUrl: res.user.photo_url || '',
          careerOrGrade: res.user.career_or_grade || '',
          equippedAnimal: res.user.equipped_animal || 'owl',
        });
        if (res.user.equipped_animal) equipAnimal(res.user.equipped_animal);
        onSuccess(res.user);
        onClose();
        setIsMotivationOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login('estudiante@misemaforo.edu.co', 'estudiante123');
      localStorage.setItem('misemaforo_token', res.token);
      setUserProfile({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        studentLevel: res.user.student_level,
        photoUrl: res.user.photo_url || '',
        careerOrGrade: res.user.career_or_grade || 'Ingeniería & Ciencias',
        equippedAnimal: res.user.equipped_animal || 'owl',
      });
      onSuccess(res.user);
      onClose();
      setIsMotivationOpen(true);
    } catch {
      setError('Error al ingresar con cuenta demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-lg my-8 p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-2.5xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Acceso MiSemaforo</span>
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
          {isRegister ? 'Personaliza tu Cuenta 🚦' : 'Inicia Sesión en MiSemaforo'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isRegister
            ? 'Configura tu grado o carrera y elige a tu primera mascota de estudio.'
            : 'Accede a tus materias, horarios, compañeros y racha.'}
        </p>

        {error && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {isRegister && (
            <>
              {/* Foto de perfil opcional */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Foto de Perfil (Opcional):
                  </label>
                  <label className="text-2.5xs text-emerald-600 dark:text-emerald-400 font-extrabold cursor-pointer hover:underline">
                    Haz clic para subir una foto
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tu nombre y apellido"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Selector de Etapa: Colegio vs Universidad */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  ¿En qué etapa académica estás?
                </label>
                <div className="grid grid-cols-2 gap-2">
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
                      <span className="text-2.5xs text-slate-400">Bachillerato</span>
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
                      <span className="text-2.5xs text-slate-400">Pregrado</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Grado o Carrera */}
              {stage === 'school' ? (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Grado Escolar:
                  </label>
                  <select
                    value={selectedSchoolGrade}
                    onChange={(e) => setSelectedSchoolGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {SCHOOL_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.emoji} {tmpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Carrera / Área de Estudio:
                  </label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => setSelectedCareer(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2 font-medium"
                  >
                    {UNIVERSITY_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.emoji} {tmpl.name}
                      </option>
                    ))}
                  </select>

                  {selectedCareer === 'personalizada' && (
                    <input
                      type="text"
                      placeholder="Escribe el nombre de tu carrera..."
                      value={customCareer}
                      onChange={(e) => setCustomCareer(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      required
                    />
                  )}
                </div>
              )}

              {/* Mascota Inicial */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Elige tu Mascota Inicial:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ANIMAL_COMPANIONS.slice(0, 4).map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setChosenAnimal(pet.id)}
                      className={`p-2 rounded-2xl border text-center transition-all ${
                        chosenAnimal === pet.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl block mb-0.5">{pet.emoji}</span>
                      <span className="font-heading font-black text-2.5xs block">{pet.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="email"
                placeholder="ejemplo@correo.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-game w-full py-3 mt-2 rounded-2xl text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Procesando...' : isRegister ? 'Crear Cuenta y Empezar' : 'Entrar a MiSemaforo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-heading font-black text-2.5xs transition-colors"
          >
            Entrar como Demo
          </button>
        </div>
      </div>
    </div>
  );
};
