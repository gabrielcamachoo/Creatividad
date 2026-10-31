import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BatiEquipped,
  Badge,
  Mission,
  DailyChestDrop,
  ShopItem,
} from '@/types';
import { REWARDS_CONFIG } from '@/config/rewards.config';
import {
  calculateRank,
  rollDailyChest,
  processDayStreak,
  evaluateBadges,
} from '@/lib/rewardEngine';

interface ActionCountTracker {
  date: string;
  createTopic: number;
  reviewAction: number;
  challenge60s: number;
}

interface GamificationState {
  xp: number;
  volts: number;
  streakDays: number;
  shieldsCount: number;
  lastActiveDate: string;
  isStreakPaused: boolean;
  lastChestOpenDate: string | null;

  equippedBati: BatiEquipped;
  unlockedItems: string[];

  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  badges: Badge[];

  // Contadores para insignias y estadísticas
  userStats: {
    totalReviews: number;
    challenges60sCount: number;
    shopPurchasesCount: number;
    shieldsUsedCount: number;
    hasViewedMethodology: boolean;
    hasUsedExamMode: boolean;
  };

  // Límites anti-grind
  dailyActions: ActionCountTracker;

  // Notificaciones modales en cola
  newLevelUnlocked: number | null;
  newBadgesUnlocked: Badge[];
  recentChestDrop: DailyChestDrop | null;

  // Acciones
  addXP: (amount: number, reason?: string) => void;
  addVolts: (amount: number) => void;
  spendVolts: (amount: number) => boolean;
  openDailyChest: (currentDateStr: string, force?: boolean) => DailyChestDrop | null;
  claimMission: (missionId: string) => void;
  buyShopItem: (item: ShopItem) => boolean;
  equipAccessory: (category: 'hat' | 'aura' | 'animal', assetKey?: string) => void;
  equipAnimal: (animalKey?: string) => void;
  adoptAnimal: (animalKey: string, priceVolts: number) => boolean;
  recordTopicReview: (currentDateStr: string, wasLowBattery: boolean) => void;
  recordStatusChange: (oldStatus: string, newStatus: string) => void;
  record60sChallenge: (currentDateStr: string) => void;
  recordMethodologyViewed: () => void;
  recordExamModeUsed: () => void;
  checkAndAwardBadges: (subjects: any, currentDateStr: string) => void;
  syncStreak: (currentDateStr: string) => void;
  toggleStreakPause: () => void;
  clearNewLevelModal: () => void;
  clearBadgeModal: () => void;
  clearChestModal: () => void;
  loadDemoProfile: () => void;
  resetGamification: () => void;
}

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      volts: 0,
      streakDays: 0,
      shieldsCount: 1,
      lastActiveDate: getTodayStr(),
      isStreakPaused: false,
      lastChestOpenDate: null,

      equippedBati: {
        hat: undefined,
        aura: undefined,
        animal: 'owl',
      },
      unlockedItems: ['streak_shield', 'owl'],

      dailyMissions: REWARDS_CONFIG.initialDailyMissions,
      weeklyMissions: REWARDS_CONFIG.initialWeeklyMissions,
      badges: REWARDS_CONFIG.badges,

      userStats: {
        totalReviews: 0,
        challenges60sCount: 0,
        shopPurchasesCount: 0,
        shieldsUsedCount: 0,
        hasViewedMethodology: false,
        hasUsedExamMode: false,
      },

      dailyActions: {
        date: getTodayStr(),
        createTopic: 0,
        reviewAction: 0,
        challenge60s: 0,
      },

      newLevelUnlocked: null,
      newBadgesUnlocked: [],
      recentChestDrop: null,

      addXP: (amount: number) => {
        const currentXP = get().xp;
        const currentRankInfo = calculateRank(currentXP);
        const newXP = currentXP + amount;
        const newRankInfo = calculateRank(newXP);

        const voltsToAdd = Math.floor(amount * REWARDS_CONFIG.volts.xpToVoltsRatio);

        set((state) => ({
          xp: newXP,
          volts: state.volts + voltsToAdd,
          newLevelUnlocked:
            newRankInfo.level > currentRankInfo.level ? newRankInfo.level : state.newLevelUnlocked,
        }));
      },

      addVolts: (amount: number) => {
        set((state) => ({ volts: state.volts + amount }));
      },

      spendVolts: (amount: number) => {
        if (get().volts < amount) return false;
        set((state) => ({ volts: state.volts - amount }));
        return true;
      },

      openDailyChest: (currentDateStr: string, force: boolean = false) => {
        const { lastChestOpenDate } = get();
        if (!force && lastChestOpenDate === currentDateStr) {
          return null;
        }

        const drop = rollDailyChest();
        set((state) => {
          let updatedVolts = state.volts;
          let updatedXP = state.xp;
          let updatedShields = state.shieldsCount;
          let updatedItems = [...state.unlockedItems];

          if (drop.type === 'volts') {
            updatedVolts += drop.amount;
          } else if (drop.type === 'xp') {
            updatedXP += drop.amount;
          } else if (drop.type === 'streak_shield') {
            updatedShields = Math.min(2, updatedShields + 1);
          } else if (drop.type === 'cosmetic' && drop.itemKey) {
            if (!updatedItems.includes(drop.itemKey)) {
              updatedItems.push(drop.itemKey);
            }
          }

          return {
            lastChestOpenDate: currentDateStr,
            volts: updatedVolts,
            xp: updatedXP,
            shieldsCount: updatedShields,
            unlockedItems: updatedItems,
            recentChestDrop: drop,
          };
        });

        return drop;
      },

      claimMission: (missionId: string) => {
        const { dailyMissions, weeklyMissions } = get();
        const mission =
          dailyMissions.find((m) => m.id === missionId) ||
          weeklyMissions.find((m) => m.id === missionId);

        if (!mission || !mission.completed || mission.claimed) return;

        get().addXP(mission.rewardXP);
        get().addVolts(mission.rewardVolts);

        set((state) => ({
          dailyMissions: state.dailyMissions.map((m) =>
            m.id === missionId ? { ...m, claimed: true } : m
          ),
          weeklyMissions: state.weeklyMissions.map((m) =>
            m.id === missionId ? { ...m, claimed: true } : m
          ),
        }));
      },

      buyShopItem: (item: ShopItem) => {
        const currentVolts = get().volts;
        if (currentVolts < item.priceVolts) return false;

        const isShield = item.category === 'shield';
        if (isShield && get().shieldsCount >= 2) {
          return false;
        }

        set((state) => {
          const newVolts = state.volts - item.priceVolts;
          const newItems = state.unlockedItems.includes(item.assetKey)
            ? state.unlockedItems
            : [...state.unlockedItems, item.assetKey];

          return {
            volts: newVolts,
            unlockedItems: newItems,
            shieldsCount: isShield ? Math.min(2, state.shieldsCount + 1) : state.shieldsCount,
            userStats: {
              ...state.userStats,
              shopPurchasesCount: state.userStats.shopPurchasesCount + 1,
            },
          };
        });

        return true;
      },

      equipAccessory: (category: 'hat' | 'aura' | 'animal', assetKey?: string) => {
        set((state) => ({
          equippedBati: {
            ...state.equippedBati,
            [category]: assetKey,
          },
        }));
      },

      equipAnimal: (animalKey?: string) => {
        set((state) => ({
          equippedBati: {
            ...state.equippedBati,
            animal: animalKey,
          },
        }));
      },

      adoptAnimal: (animalKey: string, priceVolts: number) => {
        const currentVolts = get().volts;
        if (currentVolts < priceVolts) return false;

        set((state) => ({
          volts: state.volts - priceVolts,
          unlockedItems: state.unlockedItems.includes(animalKey)
            ? state.unlockedItems
            : [...state.unlockedItems, animalKey],
          equippedBati: {
            ...state.equippedBati,
            animal: animalKey,
          },
          userStats: {
            ...state.userStats,
            shopPurchasesCount: state.userStats.shopPurchasesCount + 1,
          },
        }));
        return true;
      },

      recordTopicReview: (currentDateStr: string, wasLowBattery: boolean) => {
        const { dailyActions, userStats } = get();

        const isSameDay = dailyActions.date === currentDateStr;
        const currentActionCount = isSameDay ? dailyActions.reviewAction : 0;
        if (currentActionCount >= REWARDS_CONFIG.dailyLimits.reviewAction) {
          return;
        }

        const baseXP = wasLowBattery ? REWARDS_CONFIG.xp.reviewLowBattery : 15;
        get().addXP(baseXP);
        get().syncStreak(currentDateStr);

        const updateMissionProgress = (m: Mission) => {
          if (m.category === 'reviews' && !m.completed) {
            const newCur = m.current + 1;
            return {
              ...m,
              current: newCur,
              completed: newCur >= m.target,
            };
          }
          return m;
        };

        set((state) => ({
          dailyActions: {
            date: currentDateStr,
            createTopic: isSameDay ? state.dailyActions.createTopic : 0,
            reviewAction: currentActionCount + 1,
            challenge60s: isSameDay ? state.dailyActions.challenge60s : 0,
          },
          userStats: {
            ...userStats,
            totalReviews: userStats.totalReviews + 1,
          },
          dailyMissions: state.dailyMissions.map(updateMissionProgress),
          weeklyMissions: state.weeklyMissions.map(updateMissionProgress),
        }));
      },

      recordStatusChange: (oldStatus: string, newStatus: string) => {
        if (oldStatus === 'red' && newStatus === 'yellow') {
          get().addXP(REWARDS_CONFIG.xp.upgradeToYellow);
        } else if (newStatus === 'green') {
          get().addXP(REWARDS_CONFIG.xp.upgradeToGreen);
        }

        set((state) => ({
          dailyMissions: state.dailyMissions.map((m) =>
            m.category === 'mastery' && !m.completed
              ? { ...m, current: m.current + 1, completed: m.current + 1 >= m.target }
              : m
          ),
        }));
      },

      record60sChallenge: () => {
        get().addXP(REWARDS_CONFIG.xp.completeChallenge60s);
        set((state) => ({
          userStats: {
            ...state.userStats,
            challenges60sCount: state.userStats.challenges60sCount + 1,
          },
          dailyMissions: state.dailyMissions.map((m) =>
            m.category === 'challenge' && !m.completed
              ? { ...m, current: m.current + 1, completed: m.current + 1 >= m.target }
              : m
          ),
          weeklyMissions: state.weeklyMissions.map((m) =>
            m.category === 'challenge' && !m.completed
              ? { ...m, current: m.current + 1, completed: m.current + 1 >= m.target }
              : m
          ),
        }));
      },

      recordMethodologyViewed: () => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            hasViewedMethodology: true,
          },
        }));
      },

      recordExamModeUsed: () => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            hasUsedExamMode: true,
          },
        }));
      },

      checkAndAwardBadges: (subjects: any, currentDateStr: string) => {
        const { badges, userStats, streakDays } = get();
        const newlyUnlockedIds = evaluateBadges(
          badges,
          subjects,
          { ...userStats, streakDays },
          currentDateStr
        );

        if (newlyUnlockedIds.length === 0) return;

        const unlockedBadgesList: Badge[] = [];

        set((state) => ({
          badges: state.badges.map((b) => {
            if (newlyUnlockedIds.includes(b.id) && !b.unlockedAt) {
              const updated = { ...b, unlockedAt: currentDateStr };
              unlockedBadgesList.push(updated);
              return updated;
            }
            return b;
          }),
          newBadgesUnlocked: [...state.newBadgesUnlocked, ...unlockedBadgesList],
        }));
      },

      syncStreak: (currentDateStr: string) => {
        const { lastActiveDate, streakDays, shieldsCount, isStreakPaused } = get();
        if (streakDays === 0) {
          set({
            streakDays: 1,
            lastActiveDate: currentDateStr,
          });
          return;
        }
        const res = processDayStreak(
          lastActiveDate,
          currentDateStr,
          streakDays,
          shieldsCount,
          isStreakPaused
        );

        set((state) => ({
          streakDays: res.newStreak,
          shieldsCount: res.newShields,
          lastActiveDate: currentDateStr,
          userStats: {
            ...state.userStats,
            shieldsUsedCount: res.shieldConsumed
              ? state.userStats.shieldsUsedCount + 1
              : state.userStats.shieldsUsedCount,
          },
        }));
      },

      toggleStreakPause: () => {
        set((state) => ({ isStreakPaused: !state.isStreakPaused }));
      },

      clearNewLevelModal: () => set({ newLevelUnlocked: null }),
      clearBadgeModal: () => set({ newBadgesUnlocked: [] }),
      clearChestModal: () => set({ recentChestDrop: null }),

      loadDemoProfile: () => {
        set({
          xp: 280,
          volts: 45,
          streakDays: 5,
          shieldsCount: 1,
          lastActiveDate: getTodayStr(),
          isStreakPaused: false,
          equippedBati: { hat: undefined, aura: undefined, animal: 'owl' },
          unlockedItems: ['streak_shield', 'owl'],
          userStats: {
            totalReviews: 8,
            challenges60sCount: 3,
            shopPurchasesCount: 0,
            shieldsUsedCount: 0,
            hasViewedMethodology: false,
            hasUsedExamMode: false,
          },
          dailyMissions: REWARDS_CONFIG.initialDailyMissions,
          weeklyMissions: REWARDS_CONFIG.initialWeeklyMissions,
          badges: REWARDS_CONFIG.badges.map((b) =>
            ['first_review', 'speedy_60s', 'polymath'].includes(b.id)
              ? { ...b, unlockedAt: getTodayStr() }
              : b
          ),
        });
      },

      resetGamification: () => {
        set({
          xp: 0,
          volts: 0,
          streakDays: 0,
          shieldsCount: 1,
          lastActiveDate: getTodayStr(),
          isStreakPaused: false,
          lastChestOpenDate: null,
          equippedBati: { animal: 'owl' },
          unlockedItems: ['streak_shield', 'owl'],
          dailyMissions: REWARDS_CONFIG.initialDailyMissions,
          weeklyMissions: REWARDS_CONFIG.initialWeeklyMissions,
          badges: REWARDS_CONFIG.badges,
          userStats: {
            totalReviews: 0,
            challenges60sCount: 0,
            shopPurchasesCount: 0,
            shieldsUsedCount: 0,
            hasViewedMethodology: false,
            hasUsedExamMode: false,
          },
        });
      },
    }),
    {
      name: 'semaforo_gamification_v2',
    }
  )
);
