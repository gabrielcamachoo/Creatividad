import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateRank, calculateBatiMood } from '@/lib/rewardEngine';
import { ANIMAL_COMPANIONS } from '@/config/curriculum.config';
import { WeeklySummaryCard } from './WeeklySummaryCard';
import { FriendsStudyCard } from './FriendsStudyCard';
import { BatiAvatar } from '@/components/common/BatiAvatar';
import { useTimeStore } from '@/store/useTimeStore';
import { api } from '@/lib/api';
import {
  Flame,
  Zap,
  Award,
  TrendingUp,
  Camera,
  GraduationCap,
  School,
  Edit2,
  Heart,
  LogOut,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    xp,
    volts,
    streakDays,
    badges,
    equippedBati,
    userStats,
    dailyActions,
    equipAnimal,
    unlockedItems,
    resetGamification,
  } = useGamificationStore();
  const { subjects, resetAllSubjects } = useStudyStore();
  const { userProfile, setUserProfile, studentLevel, logoutUser } = useSettingsStore();
  const { getSimulatedDateStr } = useTimeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [careerInput, setCareerInput] = useState(userProfile.careerOrGrade);

  const currentDateStr = getSimulatedDateStr();
  const rankInfo = calculateRank(xp);
  const batiStatus = calculateBatiMood(subjects, currentDateStr);

  const allTopics = subjects.flatMap((s) => s.topics);
  const greenTopics = allTopics.filter((t) => t.status === 'green').length;
  const unlockedBadges = badges.filter((b) => b.unlockedAt).length;

  // Construir historial semanal real basado en el día actual y los repasos hechos por el usuario
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const jsDay = new Date().getDay(); // 0=Dom, 1=Lun...
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const weeklyHistory = dayLabels.map((dayName, idx) => ({
    dayName,
    reviewsCount: idx === todayIdx ? dailyActions.reviewAction || userStats.totalReviews : 0,
  }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La foto debe ser menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUserProfile({ photoUrl: base64 });
      try {
        await api.updateProfile({ photoUrl: base64 });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setUserProfile({
      name: nameInput.trim() || userProfile.name,
      careerOrGrade: careerInput.trim() || userProfile.careerOrGrade,
    });
    setIsEditing(false);
    try {
      await api.updateProfile({
        name: nameInput.trim() || userProfile.name,
        careerOrGrade: careerInput.trim() || userProfile.careerOrGrade,
      });
    } catch {}
  };

  const handleEquipPet = async (petId: string) => {
    equipAnimal(petId);
    setUserProfile({ equippedAnimal: petId });
    try {
      await api.updateProfile({ equippedAnimal: petId });
    } catch {}
  };

  const handleLogout = () => {
    if (confirm('¿Deseas cerrar tu sesión actual?')) {
      resetAllSubjects();
      resetGamification();
      logoutUser();
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in text-left">
      {/* Tarjeta de Identidad del Estudiante */}
      <div className="card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          {/* Avatar con botón de cámara */}
          <div className="relative group shrink-0">
            <div className="p-2.5 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/30 shadow-md">
              <BatiAvatar
                mood={batiStatus.mood}
                equipped={equippedBati}
                photoUrl={userProfile.photoUrl}
                size="lg"
              />
            </div>
            <label
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-md transition-transform hover:scale-110 active:scale-95"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div>
            {isEditing ? (
              <div className="space-y-2 mb-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Tu Nombre"
                />
                <input
                  type="text"
                  value={careerInput}
                  onChange={(e) => setCareerInput(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Carrera o Grado escolar"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="btn-game px-3 py-1 text-xs font-black bg-emerald-500 text-white rounded-xl"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                    {userProfile.name || 'Estudiante'}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Editar perfil"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-heading font-black">
                    Nivel {rankInfo.level}: {rankInfo.rank}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1 font-semibold">
                    {studentLevel === 'school' ? (
                      <>
                        <School className="w-3.5 h-3.5 text-blue-500" />
                        <span>{userProfile.careerOrGrade || 'Bachillerato'}</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                        <span>{userProfile.careerOrGrade || 'Universidad'}</span>
                      </>
                    )}
                  </span>
                  {userProfile.email && (
                    <>
                      <span>•</span>
                      <span>{userProfile.email}</span>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Barra de progreso de nivel */}
            <div className="w-full max-w-xs mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-2.5xs text-slate-400 mb-1 font-bold">
                <span>{xp} XP</span>
                <span>Meta: {rankInfo.nextLevelXP} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${rankInfo.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-center sm:justify-start">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mini stats Bento */}
        <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto shrink-0 text-center">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1 fill-orange-500" />
            <span className="text-lg font-heading font-black text-orange-600 dark:text-orange-400">
              {streakDays}d
            </span>
            <p className="text-2.5xs font-bold text-slate-500">Racha</p>
          </div>

          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Zap className="w-4 h-4 text-blue-500 mx-auto mb-1 fill-blue-500" />
            <span className="text-lg font-heading font-black text-blue-600 dark:text-blue-400">
              {volts}
            </span>
            <p className="text-2.5xs font-bold text-slate-500">Voltios ⚡</p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <Award className="w-4 h-4 text-purple-500 mx-auto mb-1" />
            <span className="text-lg font-heading font-black text-purple-600 dark:text-purple-400">
              {unlockedBadges}
            </span>
            <p className="text-2.5xs font-bold text-slate-500">Insignias</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-lg font-heading font-black text-emerald-600 dark:text-emerald-400 block mb-0.5">
              🟢 {greenTopics}
            </span>
            <p className="text-2.5xs font-bold text-slate-500">Dominados</p>
          </div>
        </div>
      </div>

      {/* Selector de Mascota Activa */}
      <div className="card p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Mascota de Compañía Activa</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Elige qué animalito acompaña a tu avatar mientras estudias.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {ANIMAL_COMPANIONS.map((pet) => {
            const isEquipped = equippedBati.animal === pet.id;
            const isUnlocked = unlockedItems.includes(pet.id) || pet.priceVolts === 0;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => isUnlocked && handleEquipPet(pet.id)}
                disabled={!isUnlocked}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  isEquipped
                    ? 'border-2 border-emerald-500 bg-emerald-500/10 ring-4 ring-emerald-500/15'
                    : isUnlocked
                    ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                    : 'border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 opacity-40 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl mb-1">{pet.emoji}</span>
                <span className="font-heading font-black text-xs text-slate-900 dark:text-white block leading-tight">
                  {pet.name}
                </span>
                <span className="text-2.5xs text-slate-400 mt-1 font-bold">
                  {isEquipped ? '✓ Activa' : isUnlocked ? 'Equipar' : `${pet.priceVolts}⚡`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Red de Amigos */}
      <FriendsStudyCard />

      {/* Resumen Semanal */}
      <WeeklySummaryCard
        masteredCount={greenTopics}
        batteriesRechargedCount={userStats.totalReviews}
        totalXpThisWeek={xp}
      />

      {/* Gráfica de Progreso Semanal Real (Ultraligera & Interactiva) */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 grid place-items-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                Tus Repasos de la Semana
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actividad real registrada al repasar tus temas día a día.
              </p>
            </div>
          </div>
          <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {userStats.totalReviews} repasos totales
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2.5 sm:gap-4 items-end h-44 pt-6 px-2">
          {weeklyHistory.map((item, idx) => {
            const maxVal = Math.max(5, ...weeklyHistory.map((w) => w.reviewsCount));
            const heightPct = Math.max(8, Math.round((item.reviewsCount / maxVal) * 100));
            const isToday = idx === todayIdx;

            return (
              <div key={item.dayName} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span
                  className={`text-[11px] font-mono font-black transition-all ${
                    item.reviewsCount > 0
                      ? 'text-emerald-500 scale-105'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {item.reviewsCount}
                </span>
                <div className="w-full max-w-[42px] h-28 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1 flex items-end overflow-hidden border border-slate-200/60 dark:border-white/5">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-xl transition-all duration-500 ${
                      item.reviewsCount > 0
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-glow'
                        : isToday
                        ? 'bg-emerald-500/30'
                        : 'bg-slate-300/50 dark:bg-slate-700/50'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'text-emerald-600 dark:text-emerald-400 font-black'
                      : 'text-slate-400'
                  }`}
                >
                  {item.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
