export type PlayerRank = 'Novato' | 'Explorador' | 'Estratega' | 'Maestro del Hilo';

export type BatiMood = 'happy' | 'neutral' | 'tired' | 'sleeping';

export interface BatiEquipped {
  hat?: string;               // 'grad_cap' | 'sunglasses' | 'headband' | 'crown' | 'headphones'
  aura?: string;              // 'electric' | 'fire' | 'zen'
  animal?: string;            // 'owl' | 'fox' | 'cat' | 'dog' | 'dragon' | 'axolotl' | 'robot'
}

export interface AnimalCompanion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bonus: string;
  unlocked: boolean;
  priceVolts: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXP: number;
  rewardVolts: number;
  type: 'daily' | 'weekly';
  completed: boolean;
  claimed: boolean;
  category: 'reviews' | 'mastery' | 'challenge' | 'full_battery';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  hint: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
  unlockedAt?: string; // ISO date
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'bati_accessory' | 'animal' | 'shield' | 'theme';
  priceVolts: number;
  description: string;
  assetKey: string;
  emoji?: string;
}

export type ChestDropType = 'volts' | 'xp' | 'cosmetic' | 'streak_shield';

export interface DailyChestDrop {
  type: ChestDropType;
  amount: number;
  itemKey?: string;
  label: string;
  description: string;
}

export interface SimulatedPeer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  weeklyXP: number;
  streakDays: number;
  dominantColor: string;
}

export interface WeeklyHistoryPoint {
  dayName: string;
  dateStr: string;
  reviewsCount: number;
  xpEarned: number;
  masteredCount: number;
}
