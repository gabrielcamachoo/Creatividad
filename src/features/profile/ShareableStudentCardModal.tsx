import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateRank } from '@/lib/rewardEngine';
import { soundEngine } from '@/lib/soundEffects';
import { triggerConfetti } from '@/lib/confetti';
import {
  X,
  Share2,
  Copy,
  Check,
  Flame,
  Zap,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ShareableStudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANIMAL_EMOJIS: Record<string, string> = {
  condor: '🦅',
  bear: '🐻',
  capybara: '🦫',
  fenix: '🔥',
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
};

export const ShareableStudentCardModal: React.FC<ShareableStudentCardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { xp, volts, streakDays, equippedBati, badges } = useGamificationStore();
  const { subjects } = useStudyStore();
  const { userProfile } = useSettingsStore();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rank = calculateRank(xp);
  const petEmoji = ANIMAL_EMOJIS[equippedBati.animal || userProfile.equippedAnimal || 'owl'] || '🦉';

  const allTopics = subjects.flatMap((s) => s.topics);
  const greenTopics = allTopics.filter((t) => t.status === 'green').length;
  const masteryPct = allTopics.length > 0 ? Math.round((greenTopics / allTopics.length) * 100) : 0;
  const unlockedBadges = badges.filter((b) => b.unlockedAt).length;

  const shareText = `🚦 MiSemáforo Quest · Logros Académicos 🎓
👤 ${userProfile.name || 'Estudiante'} (${userProfile.careerOrGrade || 'Pregrado'})
🔥 Racha: ${streakDays} días consecutivos de estudio
🟢 Dominio: ${masteryPct}% de temas dominados (${greenTopics}/${allTopics.length})
⚡ Rango: Nivel ${rank.level} · ${rank.rank}
🐾 Mascota: ${petEmoji}
¡Vence la curva del olvido estudiando con semáforo y batería de 7 días!
👉 https://misemaforo-quest.netlify.app/`;

  const handleCopy = async () => {
    soundEngine.playSuccessChime();
    triggerConfetti(1500, 35);
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Texto copiado al portapapeles');
    }
  };

  const handleNativeShare = async () => {
    soundEngine.playSuccessChime();
    triggerConfetti(2000, 50);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Logros de ${userProfile.name} en MiSemáforo`,
          text: shareText,
          url: 'https://misemaforo-quest.netlify.app/',
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 grid place-items-center">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-heading font-black text-slate-900 dark:text-white">
                Tarjeta de Logros Compartible 🏆
              </h2>
              <p className="text-[10px] text-slate-400">
                Comparte tu disciplina y racha en WhatsApp e Instagram
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjeta Visual Estilo Wrapped */}
        <div className="my-4 p-5 rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#111c33] to-[#0a101f] text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo y Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🚦</span>
              <span className="font-heading font-black text-xs text-white">
                Mi<span className="text-emerald-400">Semáforo</span>
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 font-bold border border-white/10">
              SEMESTRE 2026
            </span>
          </div>

          {/* Perfil del Estudiante */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 grid place-items-center text-3xl shadow-inner shrink-0">
              {petEmoji}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-black text-base text-white truncate leading-tight">
                {userProfile.name || 'Estudiante'}
              </h3>
              <p className="text-[11px] text-emerald-300/90 font-medium truncate">
                {userProfile.careerOrGrade || 'Pontificia Universidad Javeriana'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  Nivel {rank.level} · {rank.rank}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas Clave Bento */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Racha</span>
              <span className="font-heading font-black text-lg text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" /> {streakDays}d
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Dominio</span>
              <span className="font-heading font-black text-lg text-emerald-400">
                {masteryPct}%
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Voltios</span>
              <span className="font-heading font-black text-lg text-sky-400 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-sky-400" /> {volts}
              </span>
            </div>
          </div>

          {/* Sello de Calidad Pedagógica */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Active Recall · Curva Ebbinghaus</span>
            <span className="text-emerald-400 font-bold">✓ Certificado</span>
          </div>
        </div>

        {/* Botones de Compartir */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-game py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-heading font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="btn-game py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-heading font-black flex items-center justify-center gap-1.5 transition shadow-glow"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
