import { REWARDS_CONFIG } from '@/config/rewards.config';
import { PlayerRank, BatiMood, DailyChestDrop, Badge, Subject } from '@/types';
import { getDaysDifference } from './timeEngine';
import { calculateBatteryBlocks } from './studyEngine';

/**
 * Calcula el rango y progreso del jugador según XP acumulado.
 */
export function calculateRank(xp: number): {
  rank: PlayerRank;
  level: number;
  currentLevelMinXP: number;
  nextLevelXP: number;
  progressPercent: number;
  perk: string;
} {
  const ranks = REWARDS_CONFIG.ranks;
  let currentRank = ranks[0];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (xp >= ranks[i].minXP) {
      currentRank = ranks[i];
      break;
    }
  }

  const nextRank = ranks.find((r) => r.level === currentRank.level + 1);
  const nextLevelXP = nextRank ? nextRank.minXP : currentRank.minXP + 500;
  const currentLevelMinXP = currentRank.minXP;

  const xpInCurrentLevel = Math.max(0, xp - currentLevelMinXP);
  const xpNeededForNext = Math.max(1, nextLevelXP - currentLevelMinXP);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  return {
    rank: currentRank.name as PlayerRank,
    level: currentRank.level,
    currentLevelMinXP,
    nextLevelXP,
    progressPercent,
    perk: currentRank.perk,
  };
}

/**
 * Apertura de Cofre Diario con probabilidades configurables en rewards.config.ts.
 * Acepta un generador pseudoaleatorio inyectable `seedRandom` para testeo determinista en Vitest.
 */
export function rollDailyChest(seedRandom: () => number = Math.random): DailyChestDrop {
  const roll = seedRandom();
  let cumulative = 0;

  for (const item of REWARDS_CONFIG.chestProbabilities) {
    cumulative += item.probability;
    if (roll <= cumulative) {
      if (item.type === 'volts') {
        const min = item.minAmount || 15;
        const max = item.maxAmount || 40;
        const amount = Math.floor(min + seedRandom() * (max - min + 1));
        return {
          type: 'volts',
          amount,
          label: `${amount} Voltios ⚡`,
          description: '¡Energía pura para canjear en la tienda de recompensas!',
        };
      } else if (item.type === 'xp') {
        const min = item.minAmount || 50;
        const max = item.maxAmount || 100;
        const amount = Math.floor(min + seedRandom() * (max - min + 1));
        return {
          type: 'xp',
          amount,
          label: `+${amount} XP de Bono 🧠`,
          description: '¡Impulso directo para subir al siguiente nivel de maestría!',
        };
      } else if (item.type === 'cosmetic') {
        return {
          type: 'cosmetic',
          amount: 1,
          itemKey: item.itemKey || 'hat_sunglasses',
          label: item.label,
          description: '¡Nuevo accesorio desbloqueado para vestir a tu mascota Bati!',
        };
      } else if (item.type === 'streak_shield') {
        return {
          type: 'streak_shield',
          amount: 1,
          label: 'Escudo de Racha 🛡️',
          description: '¡Protección garantizada ante días libres o semanas de parciales!',
        };
      }
    }
  }

  // Fallback seguro
  return {
    type: 'volts',
    amount: 20,
    label: '20 Voltios ⚡',
    description: '¡Buena recarga para tu billetera de estudiante!',
  };
}

/**
 * Procesa la racha diaria y el uso de escudos protectores.
 */
export function processDayStreak(
  lastActiveDateStr: string,
  currentDateStr: string,
  currentStreak: number,
  shieldsCount: number,
  isPaused: boolean = false
): {
  newStreak: number;
  newShields: number;
  shieldConsumed: boolean;
  streakBroken: boolean;
} {
  if (isPaused) {
    return {
      newStreak: currentStreak,
      newShields: shieldsCount,
      shieldConsumed: false,
      streakBroken: false,
    };
  }

  const daysDiff = getDaysDifference(lastActiveDateStr, currentDateStr);

  if (daysDiff === 0) {
    // Mismo día: mantiene racha actual
    return {
      newStreak: Math.max(1, currentStreak),
      newShields: shieldsCount,
      shieldConsumed: false,
      streakBroken: false,
    };
  }

  if (daysDiff === 1) {
    // Día consecutivo: racha sube en 1
    return {
      newStreak: currentStreak + 1,
      newShields: shieldsCount,
      shieldConsumed: false,
      streakBroken: false,
    };
  }

  // Han pasado 2 o más días: se perdió un día
  if (shieldsCount > 0) {
    // Escudo absorbe la ausencia
    return {
      newStreak: currentStreak,
      newShields: shieldsCount - 1,
      shieldConsumed: true,
      streakBroken: false,
    };
  }

  // Sin escudos: reinicia racha a 1
  return {
    newStreak: 1,
    newShields: 0,
    shieldConsumed: false,
    streakBroken: true,
  };
}

/**
 * Calcula el estado de ánimo emocional de la mascota Bati
 * según el promedio de bloques de frescura de todos los temas.
 */
export function calculateBatiMood(subjects: Subject[], currentDate: string): {
  mood: BatiMood;
  averageBlocks: number;
  message: string;
} {
  let totalBlocks = 0;
  let topicCount = 0;

  for (const s of subjects) {
    for (const t of s.topics) {
      const { blocks } = calculateBatteryBlocks(t.lastReviewedDate, currentDate);
      totalBlocks += blocks;
      topicCount++;
    }
  }

  if (topicCount === 0) {
    return {
      mood: 'happy',
      averageBlocks: 3,
      message: '¡Listo para comenzar tu aventura de estudio universitario!',
    };
  }

  const averageBlocks = totalBlocks / topicCount;

  if (averageBlocks >= 2.4) {
    return {
      mood: 'happy',
      averageBlocks,
      message: '¡Energía al máximo! Tienes tus asignaturas al día y frescas.',
    };
  }

  if (averageBlocks >= 1.7) {
    return {
      mood: 'neutral',
      averageBlocks,
      message: 'Buen ritmo. Algunos temas están empezando a perder batería.',
    };
  }

  if (averageBlocks >= 1.0) {
    return {
      mood: 'tired',
      averageBlocks,
      message: 'Uff... Me siento bajita de batería. ¡Un repaso rápido me devolverá la vida!',
    };
  }

  return {
    mood: 'sleeping',
    averageBlocks,
    message: 'Zzz... Demasiados temas en riesgo (>14 días). ¡Despiértame con un repaso!',
  };
}

/**
 * Verifica si se desbloqueó una o más insignias.
 */
export function evaluateBadges(
  badges: Badge[],
  subjects: Subject[],
  userStats: {
    totalReviews: number;
    streakDays: number;
    challenges60sCount: number;
    shopPurchasesCount: number;
    shieldsUsedCount: number;
    hasViewedMethodology: boolean;
    hasUsedExamMode: boolean;
  },
  currentDate: string
): string[] {
  const newlyUnlockedIds: string[] = [];
  const unlockedMap = new Set(badges.filter((b) => b.unlockedAt).map((b) => b.id));

  const allTopics = subjects.flatMap((s) => s.topics);
  const redCount = allTopics.filter((t) => t.status === 'red').length;
  const greenCount = allTopics.filter((t) => t.status === 'green').length;

  // 1. first_review
  if (!unlockedMap.has('first_review') && userStats.totalReviews >= 1) {
    newlyUnlockedIds.push('first_review');
  }

  // 2. zero_reds
  if (!unlockedMap.has('zero_reds') && allTopics.length >= 3 && redCount === 0) {
    newlyUnlockedIds.push('zero_reds');
  }

  // 3. battery_full (Combo mundo cargado)
  const hasFullyChargedWorld = subjects.some(
    (s) => s.topics.length >= 2 && s.topics.every((t) => calculateBatteryBlocks(t.lastReviewedDate, currentDate).blocks === 3)
  );
  if (!unlockedMap.has('battery_full') && hasFullyChargedWorld) {
    newlyUnlockedIds.push('battery_full');
  }

  // 4. streak_7
  if (!unlockedMap.has('streak_7') && userStats.streakDays >= 7) {
    newlyUnlockedIds.push('streak_7');
  }

  // 5. streak_30
  if (!unlockedMap.has('streak_30') && userStats.streakDays >= 30) {
    newlyUnlockedIds.push('streak_30');
  }

  // 6. detective_dt
  if (!unlockedMap.has('detective_dt') && userStats.hasViewedMethodology) {
    newlyUnlockedIds.push('detective_dt');
  }

  // 7. exam_ready
  if (!unlockedMap.has('exam_ready') && userStats.hasUsedExamMode) {
    newlyUnlockedIds.push('exam_ready');
  }

  // 8. speedy_60s
  if (!unlockedMap.has('speedy_60s') && userStats.challenges60sCount >= 3) {
    newlyUnlockedIds.push('speedy_60s');
  }

  // 9. master_green_5
  if (!unlockedMap.has('master_green_5') && greenCount >= 5) {
    newlyUnlockedIds.push('master_green_5');
  }

  // 10. first_shop_buy
  if (!unlockedMap.has('first_shop_buy') && userStats.shopPurchasesCount >= 1) {
    newlyUnlockedIds.push('first_shop_buy');
  }

  // 11. shield_hero
  if (!unlockedMap.has('shield_hero') && userStats.shieldsUsedCount >= 1) {
    newlyUnlockedIds.push('shield_hero');
  }

  // 12. polymath
  if (!unlockedMap.has('polymath') && subjects.filter((s) => s.topics.length > 0).length >= 3) {
    newlyUnlockedIds.push('polymath');
  }

  return newlyUnlockedIds;
}
