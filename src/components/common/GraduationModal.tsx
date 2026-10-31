import React, { useState } from 'react';
import { UNIVERSITY_TEMPLATES, CareerOption } from '@/config/curriculum.config';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { api } from '@/lib/api';
import { X, GraduationCap, Sparkles, Check, ArrowRight, Award } from 'lucide-react';

interface GraduationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({ isOpen, onClose }) => {
  const { setStudentLevel, setUserProfile, userProfile } = useSettingsStore();
  const { upgradeToUniversity } = useStudyStore();
  const { addXP, addVolts } = useGamificationStore();

  const [selectedCareerId, setSelectedCareerId] = useState<string>('sistemas');
  const [customCareerName, setCustomCareerName] = useState<string>('');
  const [successCelebration, setSuccessCelebration] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGraduate = async () => {
    const selected = UNIVERSITY_TEMPLATES.find((c) => c.id === selectedCareerId) || UNIVERSITY_TEMPLATES[0];
    const finalCareerName = selected.id === 'personalizada' && customCareerName.trim()
      ? customCareerName.trim()
      : selected.name;

    setStudentLevel('university');
    setUserProfile({
      studentLevel: 'university',
      careerOrGrade: finalCareerName,
    });
    upgradeToUniversity(selected);
    addXP(150);
    addVolts(30);

    try {
      await api.updateLevel('university');
      await api.updateProfile({
        studentLevel: 'university',
        careerOrGrade: finalCareerName,
      });
      await api.seedData('university');
    } catch (err) {
      console.warn('Graduación sincronizada localmente');
    }

    setSuccessCelebration(true);
    setTimeout(() => {
      setSuccessCelebration(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-xl my-8 p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successCelebration ? (
          <div className="py-12 text-center animate-fade-in space-y-3">
            <div className="text-6xl animate-bounce mb-2">🎓✨🎉</div>
            <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
              ¡Felicitaciones, Estudiante Universitario!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Te has graduado de bachillerato. Tu tablero ha sido adaptado con materias de pregrado (+150 XP y +30 Voltios ⚡).
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="chip bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-2.5xs">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Transición • Colegio a Universidad</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
              ¡Paso a la Universidad! 🎓
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Selecciona tu carrera o área para adaptar tu tablero y materias base.
            </p>

            {/* Selector de Carrera */}
            <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
              {UNIVERSITY_TEMPLATES.map((c) => {
                const isSelected = selectedCareerId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        {c.emoji}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {c.name}
                        </h4>
                        <p className="text-2.5xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {c.faculty} • {c.subjects.length > 0 ? `${c.subjects.length} materias preparadas` : 'Plan libre'}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCareerId === 'personalizada' && (
              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de tu Carrera o Pregrado:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Licenciatura en Idiomas, Odontología, Geología..."
                  value={customCareerName}
                  onChange={(e) => setCustomCareerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGraduate}
                className="btn-game px-6 py-2.5 text-xs font-heading font-black text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-purple-600/30 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Confirmar e Iniciar Pregrado</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
