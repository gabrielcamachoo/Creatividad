import { Badge, Mission, ShopItem } from '@/types';

export const REWARDS_CONFIG = {
  // Puntos de Experiencia por acción
  xp: {
    createTopic: 10,
    reviewLowBattery: 20,
    upgradeToYellow: 30,
    upgradeToGreen: 50, // "Sello de dominio"
    completeChallenge60s: 15,
    worldChargedBonus: 100, // Bono cuando todos los temas de una materia están en 3/3
  },

  // Conversión a Voltios ⚡
  volts: {
    xpToVoltsRatio: 0.1, // 1 voltio por cada 10 XP
    directBonusChargedWorld: 10,
  },

  // Límites diarios anti-grind (principios éticos)
  dailyLimits: {
    createTopic: 10,
    reviewAction: 15,
    challenge60s: 8,
  },

  // Umbrales de nivel
  ranks: [
    { name: 'Novato', minXP: 0, maxXP: 199, level: 1, perk: 'Iniciando el viaje' },
    { name: 'Explorador', minXP: 200, maxXP: 499, level: 2, perk: 'Desbloquea retos de 60s' },
    { name: 'Estratega', minXP: 500, maxXP: 999, level: 3, perk: 'Modo Parcial avanzado' },
    { name: 'Maestro del Hilo', minXP: 1000, maxXP: Infinity, level: 4, perk: 'Aura legendaria de Bati' },
  ],

  // Probabilidades configurables del cofre diario (suman 100%)
  chestProbabilities: [
    { type: 'volts', probability: 0.60, minAmount: 15, maxAmount: 40, label: 'Voltios extra ⚡' },
    { type: 'xp', probability: 0.25, minAmount: 50, maxAmount: 100, label: 'Bono de Experiencia 🧠' },
    { type: 'cosmetic', probability: 0.10, amount: 1, itemKey: 'hat_sunglasses', label: 'Accesorio para Bati 🕶️' },
    { type: 'streak_shield', probability: 0.05, amount: 1, label: 'Escudo de Racha 🛡️' },
  ],

  // Catálogo de la Tienda
  shopItems: [
    {
      id: 'item_shield',
      name: 'Escudo de Racha',
      category: 'shield',
      priceVolts: 30,
      description: 'Protege tu racha diaria si un día no alcanzas a estudiar (máx. 2 almacenados).',
      assetKey: 'streak_shield',
    },
    {
      id: 'item_hat_grad',
      name: 'Birrete Universitario',
      category: 'bati_accessory',
      priceVolts: 40,
      description: 'Un elegante sombrero de graduación para que Bati luzca académica.',
      assetKey: 'hat_grad_cap',
    },
    {
      id: 'item_hat_sunglasses',
      name: 'Gafas de Sol Estelares',
      category: 'bati_accessory',
      priceVolts: 35,
      description: 'Gafas oscuras para cuando tu dominio de los temas está imparable.',
      assetKey: 'hat_sunglasses',
    },
    {
      id: 'item_hat_headband',
      name: 'Banda Deportiva Ninja',
      category: 'bati_accessory',
      priceVolts: 25,
      description: 'Banda de concentración máxima para sesiones intensas de parciales.',
      assetKey: 'hat_headband',
    },
    {
      id: 'item_aura_electric',
      name: 'Aura Eléctrica Azul',
      category: 'bati_accessory',
      priceVolts: 50,
      description: 'Chispas de energía que envuelven a Bati cuando tiene baterías llenas.',
      assetKey: 'aura_electric',
    },
    {
      id: 'item_theme_cyber',
      name: 'Marco Cibernético',
      category: 'theme',
      priceVolts: 45,
      description: 'Borde de neón para tu tarjeta de perfil y avatar.',
      assetKey: 'theme_cyber',
    },
  ] as ShopItem[],

  // Catálogo de 12 Insignias
  badges: [
    {
      id: 'first_review',
      name: 'Primer Impulso',
      description: 'Completaste tu primera sesión de repaso.',
      hint: 'Repasa cualquier tema por primera vez con el botón "Repasé hoy".',
      rarity: 'common',
      icon: 'Sparkles',
    },
    {
      id: 'zero_reds',
      name: 'Cero Vacíos',
      description: 'No tienes ningún tema en Rojo en tus materias activas.',
      hint: 'Sube todos tus temas en rojo al menos a amarillo o verde.',
      rarity: 'rare',
      icon: 'ShieldCheck',
    },
    {
      id: 'battery_full',
      name: 'Batería al 100%',
      description: 'Lograste que todos los temas de una materia tengan 3/3 bloques.',
      hint: 'Consigue el combo "Mundo Cargado" en una asignatura.',
      rarity: 'rare',
      icon: 'BatteryCharging',
    },
    {
      id: 'streak_7',
      name: 'Constancia de Acero (7 días)',
      description: 'Mantuviste tu racha de estudio por 7 días seguidos.',
      hint: 'Entra a repasar 7 días continuos sin quebrar tu fuego.',
      rarity: 'rare',
      icon: 'Flame',
    },
    {
      id: 'streak_30',
      name: 'Maestro de la Disciplina (30 días)',
      description: 'Alcanzaste 30 días de racha de estudio universitario.',
      hint: 'Conserva el hábito por un mes completo con ayuda de tus escudos.',
      rarity: 'epic',
      icon: 'Crown',
    },
    {
      id: 'detective_dt',
      name: 'Detective del Problema',
      description: 'Leíste y comprendiste las 5 fases del proceso de Design Thinking.',
      hint: 'Explora la sección "Cómo llegamos aquí" hasta el final.',
      rarity: 'common',
      icon: 'Compass',
    },
    {
      id: 'exam_ready',
      name: 'Preparado para el Parcial',
      description: 'Creaste tu plan de ataque en el Modo Parcial.',
      hint: 'Ingresa una fecha de examen en el Priorizador y genera tu plan.',
      rarity: 'common',
      icon: 'CalendarCheck',
    },
    {
      id: 'speedy_60s',
      name: 'Pitch Conceptual',
      description: 'Completaste 3 retos "Explica en 60s" con autoevaluación.',
      hint: 'Usa el temporizador de 60 segundos para explicar temas en voz alta.',
      rarity: 'rare',
      icon: 'Clock',
    },
    {
      id: 'master_green_5',
      name: 'Coleccionista Verde',
      description: 'Tienes al menos 5 temas con Sello de Dominio (Verde).',
      hint: 'Domina 5 conceptos para poder explicarlos sin apuntes.',
      rarity: 'rare',
      icon: 'CheckCircle2',
    },
    {
      id: 'first_shop_buy',
      name: 'Estilista de Bati',
      description: 'Compraste tu primer accesorio o cosmético en la tienda con Voltios.',
      hint: 'Gasta tus voltios en la tienda de recompensas.',
      rarity: 'common',
      icon: 'ShoppingBag',
    },
    {
      id: 'shield_hero',
      name: 'Escudo Salvavidas',
      description: 'Un escudo de racha te protegió de perder tu fuego tras un día libre.',
      hint: 'Ten un escudo en inventario al pasar un día sin estudiar.',
      rarity: 'epic',
      icon: 'ShieldAlert',
    },
    {
      id: 'polymath',
      name: 'Estudiante Integral',
      description: 'Registraste temas en al menos 3 materias simultáneas.',
      hint: 'Crea o mantén 3 materias con temas en seguimiento.',
      rarity: 'common',
      icon: 'Layers',
    },
  ] as Badge[],

  // Misiones iniciales por defecto
  initialDailyMissions: [
    {
      id: 'daily_review_3',
      title: 'Repasador Veloz',
      description: 'Repasa al menos 2 temas que necesiten frescura hoy.',
      target: 2,
      current: 1,
      rewardXP: 30,
      rewardVolts: 5,
      type: 'daily',
      completed: false,
      claimed: false,
      category: 'reviews',
    },
    {
      id: 'daily_fix_red',
      title: 'Eliminando Dudas',
      description: 'Sube un tema de Rojo a Amarillo o Verde.',
      target: 1,
      current: 0,
      rewardXP: 40,
      rewardVolts: 6,
      type: 'daily',
      completed: false,
      claimed: false,
      category: 'mastery',
    },
    {
      id: 'daily_challenge_60s',
      title: 'Voz Alta',
      description: 'Completa un reto "Explica en 60s".',
      target: 1,
      current: 0,
      rewardXP: 25,
      rewardVolts: 4,
      type: 'daily',
      completed: false,
      claimed: false,
      category: 'challenge',
    },
  ] as Mission[],

  initialWeeklyMissions: [
    {
      id: 'weekly_reviews_10',
      title: 'Hábito Imparable',
      description: 'Completa 7 repasos a lo largo de la semana.',
      target: 7,
      current: 4,
      rewardXP: 100,
      rewardVolts: 15,
      type: 'weekly',
      completed: false,
      claimed: false,
      category: 'reviews',
    },
    {
      id: 'weekly_world_charged',
      title: 'Dominio de Materia',
      description: 'Deja una materia con el 100% de temas en 3/3 bloques.',
      target: 1,
      current: 0,
      rewardXP: 120,
      rewardVolts: 20,
      type: 'weekly',
      completed: false,
      claimed: false,
      category: 'full_battery',
    },
    {
      id: 'weekly_challenges_3',
      title: 'Orador Experto',
      description: 'Completa 3 retos de 60 segundos esta semana.',
      target: 3,
      current: 1,
      rewardXP: 80,
      rewardVolts: 12,
      type: 'weekly',
      completed: false,
      claimed: false,
      category: 'challenge',
    },
  ] as Mission[],
};
