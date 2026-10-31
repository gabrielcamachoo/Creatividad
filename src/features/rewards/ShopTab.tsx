import React from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { REWARDS_CONFIG } from '@/config/rewards.config';
import { ANIMAL_COMPANIONS } from '@/config/curriculum.config';
import { soundEffects } from '@/lib/audio';
import { ShopItem } from '@/types';
import { Zap, Shield, Sparkles, Check, ShoppingBag, Heart } from 'lucide-react';

export const ShopTab: React.FC = () => {
  const {
    volts,
    unlockedItems,
    equippedBati,
    shieldsCount,
    buyShopItem,
    equipAccessory,
    adoptAnimal,
    equipAnimal,
  } = useGamificationStore();
  const { soundEnabled, setUserProfile } = useSettingsStore();

  const handleBuy = (item: ShopItem) => {
    const success = buyShopItem(item);
    if (success) {
      soundEffects.success(soundEnabled);
    }
  };

  const handleEquipAccessoryItem = (item: ShopItem) => {
    const isHat = item.assetKey.startsWith('hat_');
    const isAura = item.assetKey.startsWith('aura_');
    const cat = isHat ? 'hat' : isAura ? 'aura' : 'animal';

    const isCurrentlyEquipped =
      (isHat && equippedBati.hat === item.assetKey) ||
      (isAura && equippedBati.aura === item.assetKey);

    equipAccessory(cat, isCurrentlyEquipped ? undefined : item.assetKey);
    soundEffects.click(soundEnabled);
  };

  const handleAdoptPet = (petId: string, price: number) => {
    const success = adoptAnimal(petId, price);
    if (success) {
      soundEffects.success(soundEnabled);
      setUserProfile({ equippedAnimal: petId });
    }
  };

  const handleEquipPet = (petId: string) => {
    equipAnimal(petId);
    setUserProfile({ equippedAnimal: petId });
    soundEffects.click(soundEnabled);
  };

  const batiAccessories = REWARDS_CONFIG.shopItems.filter((i) => i.category === 'bati_accessory');
  const shieldItems = REWARDS_CONFIG.shopItems.filter((i) => i.category === 'shield');

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Saldo */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center text-2xl shrink-0">
            🐾
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Tienda de Mascotas & Accesorios
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Canjea tus Voltios ⚡ ganados por estudiar y personaliza tu avatar con compañeros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-heading font-black text-sm shrink-0 shadow-md">
          <Zap className="w-4 h-4 fill-white" />
          <span>{volts} Voltios</span>
        </div>
      </div>

      {/* SECCIÓN 1: MASCOTAS Y ANIMALITOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Animalitos de Compañía</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cada mascota te otorga un bono especial permanente de estudio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ANIMAL_COMPANIONS.map((pet) => {
            const isOwned = unlockedItems.includes(pet.id) || pet.priceVolts === 0;
            const isEquipped = equippedBati.animal === pet.id;
            const canAfford = volts >= pet.priceVolts;

            return (
              <div
                key={pet.id}
                className={`card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'border-2 border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10'
                    : isOwned
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transform hover:scale-110 transition-transform inline-block">
                      {pet.emoji}
                    </span>
                    <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 font-heading font-black text-xs">
                      <Zap className="w-3 h-3 fill-blue-500" />
                      <span>{pet.priceVolts > 0 ? `${pet.priceVolts} ⚡` : 'Gratis'}</span>
                    </span>
                  </div>

                  <h4 className="font-heading font-black text-base text-slate-900 dark:text-white">
                    {pet.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-1 mb-3">
                    {pet.description}
                  </p>

                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-2.5xs font-bold mb-4">
                    ✨ Bono: {pet.bonus}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {isOwned ? (
                    <button
                      onClick={() => handleEquipPet(pet.id)}
                      className={`btn-game w-full py-2 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-1.5 ${
                        isEquipped
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Mascota Activa</span>
                        </>
                      ) : (
                        <span>Equipar Mascota</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdoptPet(pet.id, pet.priceVolts)}
                      disabled={!canAfford}
                      className={`btn-game w-full py-2 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Adoptar por {pet.priceVolts} ⚡</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: ACCESORIOS PARA BATI */}
      <div className="space-y-3 pt-3">
        <h3 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Gorros y Auras de Bati</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {batiAccessories.map((item) => {
            const isOwned = unlockedItems.includes(item.assetKey);
            const isEquipped =
              equippedBati.hat === item.assetKey || equippedBati.aura === item.assetKey;
            const canAfford = volts >= item.priceVolts;

            return (
              <div
                key={item.id}
                className={`card p-4 flex flex-col justify-between transition-all ${
                  isEquipped ? 'border-2 border-purple-500 bg-purple-500/5' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {item.assetKey.startsWith('hat_') ? '🎩' : '✨'}
                    </span>
                    <span className="chip bg-purple-500/10 text-purple-600 dark:text-purple-400 text-2.5xs font-bold">
                      {item.priceVolts} ⚡
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-2.5xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {isOwned ? (
                    <button
                      onClick={() => handleEquipAccessoryItem(item)}
                      className={`btn-game w-full py-1.5 rounded-xl text-xs font-heading font-black ${
                        isEquipped
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isEquipped ? '✓ Equipado' : 'Equipar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`btn-game w-full py-1.5 rounded-xl text-xs font-heading font-black ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Comprar ({item.priceVolts} ⚡)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 3: CONSUMIBLES (ESCUDOS DE RACHA) */}
      <div className="space-y-3 pt-3">
        <h3 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Protección de Racha</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {shieldItems.map((item) => {
            const canAfford = volts >= item.priceVolts;
            return (
              <div key={item.id} className="card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                      {item.name} (Tienes: {shieldsCount})
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`btn-game px-4 py-2 rounded-xl text-xs font-heading font-black shrink-0 ${
                    canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  +1 por {item.priceVolts} ⚡
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
