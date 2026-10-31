import { describe, it, expect } from 'vitest';
import { useStudyStore } from '../src/store/useStudyStore';
import { useGamificationStore } from '../src/store/useGamificationStore';

describe('Verificación de caso del usuario: Materia de Trigonometría y persistencia independiente de temas', () => {
  it('crea temas con estados independientes (verde, amarillo, rojo) y IDs únicos', () => {
    const store = useStudyStore.getState();

    // 1. Crear Materia Trigonometría
    const subId = store.addSubject('Trigonometría', 'TRI-10', 'blue', '📐', 'Fórmulas y razones', '2026-11-20');

    // 2. Agregar los 3 temas en sus respectivas categorías
    const tGreen = store.addTopic(subId, 'Teorema de Pitágoras', '2026-10-20', 'green');
    const tYellow = store.addTopic(subId, 'Razones Trigonométricas', '2026-10-18', 'yellow');
    const tRed = store.addTopic(subId, 'Identidades Trigonométricas', '2026-10-10', 'red');

    // Comprobar que los IDs son completamente distintos
    expect(tGreen.id).not.toBe(tYellow.id);
    expect(tYellow.id).not.toBe(tRed.id);
    expect(tGreen.id).not.toBe(tRed.id);

    // Comprobar que cada uno conservó su estatus exacto
    expect(tGreen.status).toBe('green');
    expect(tYellow.status).toBe('yellow');
    expect(tRed.status).toBe('red');

    // 3. Repasar ÚNICAMENTE el tema amarillo
    const prevGreenTimes = tGreen.timesReviewed;
    const prevRedTimes = tRed.timesReviewed;

    store.reviewTopicToday(subId, tYellow.id, '2026-10-29');

    const updatedSubject = useStudyStore.getState().subjects.find((s) => s.id === subId)!;
    const currentGreen = updatedSubject.topics.find((t) => t.id === tGreen.id)!;
    const currentYellow = updatedSubject.topics.find((t) => t.id === tYellow.id)!;
    const currentRed = updatedSubject.topics.find((t) => t.id === tRed.id)!;

    // Solo el amarillo fue repasado hoy
    expect(currentYellow.lastReviewedDate).toBe('2026-10-29');
    expect(currentYellow.timesReviewed).toBe(1);

    // Los temas verde y rojo NO cambiaron su fecha ni sus repasos
    expect(currentGreen.timesReviewed).toBe(prevGreenTimes);
    expect(currentGreen.lastReviewedDate).toBe('2026-10-20');
    expect(currentRed.timesReviewed).toBe(prevRedTimes);
    expect(currentRed.lastReviewedDate).toBe('2026-10-10');

    // 4. Cambiar el estatus de ÚNICAMENTE el tema rojo a amarillo
    store.updateTopicStatus(subId, tRed.id, 'yellow');

    const finalSubject = useStudyStore.getState().subjects.find((s) => s.id === subId)!;
    const finalGreen = finalSubject.topics.find((t) => t.id === tGreen.id)!;
    const finalYellow = finalSubject.topics.find((t) => t.id === tYellow.id)!;
    const finalRed = finalSubject.topics.find((t) => t.id === tRed.id)!;

    // Solo el tema rojo cambió a amarillo
    expect(finalRed.status).toBe('yellow');
    expect(finalGreen.status).toBe('green');
    expect(finalYellow.status).toBe('yellow');
  });

  it('permite guardar y actualizar fechas de clase y repaso en cada tema', () => {
    const store = useStudyStore.getState();
    const subId = store.addSubject('Física', 'FIS');
    const topic = store.addTopic(subId, 'Leyes de Newton', '2026-10-05', 'red', '2026-10-08');

    expect(topic.classDate).toBe('2026-10-05');
    expect(topic.lastReviewedDate).toBe('2026-10-08');

    store.updateTopicDates(subId, topic.id, '2026-10-06', '2026-10-12');

    const updated = useStudyStore
      .getState()
      .subjects.find((s) => s.id === subId)!
      .topics.find((t) => t.id === topic.id)!;

    expect(updated.classDate).toBe('2026-10-06');
    expect(updated.lastReviewedDate).toBe('2026-10-12');
  });

  it('permite guardar fichas de resumen y fórmulas en los temas', () => {
    const store = useStudyStore.getState();
    const subId = store.addSubject('Cálculo', 'MAT', 'blue', '📐');
    const topic = store.addTopic(subId, 'Integrales por Sustitución', undefined, 'red');

    expect(topic.summary).toBe('');

    store.updateTopicSummary(subId, topic.id, 'u = g(x), du = g\'(x)dx', 'data:image/png;base64,sample');

    const updated = useStudyStore
      .getState()
      .subjects.find((s) => s.id === subId)!
      .topics.find((t) => t.id === topic.id)!;

    expect(updated.summary).toBe('u = g(x), du = g\'(x)dx');
    expect(updated.summaryPhoto).toBe('data:image/png;base64,sample');
  });

  it('permite gestionar el horario de clases y agregar compañeros de estudio', () => {
    const store = useStudyStore.getState();

    // 1. Horario de clases
    const initialScheduleCount = store.schedule.length;
    const newItem = store.addScheduleItem({
      subjectName: 'Anatomía Humana',
      subjectEmoji: '🩺',
      dayOfWeek: 'Martes',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Salón de Disección 1',
    });

    expect(useStudyStore.getState().schedule.length).toBe(initialScheduleCount + 1);
    expect(newItem.subjectName).toBe('Anatomía Humana');

    store.deleteScheduleItem(newItem.id);
    expect(useStudyStore.getState().schedule.length).toBe(initialScheduleCount);

    // 2. Amigos y saludo (+5 Voltios)
    const initialFriendsCount = useStudyStore.getState().friends.length;
    const newFriend = store.addFriend('laura@misemaforo.edu.co', 'Laura Gómez');
    expect(useStudyStore.getState().friends.length).toBe(initialFriendsCount + 1);

    store.cheerFriend(newFriend.id);
    const cheered = useStudyStore.getState().friends.find((f) => f.id === newFriend.id);
    expect(cheered?.cheeredToday).toBe(true);
  });

  it('permite equipar y adoptar animalitos de compañía en el avatar', () => {
    const gamification = useGamificationStore.getState();

    // Mascota por defecto es búho
    expect(gamification.equippedBati.animal).toBe('owl');

    // Equipar zorro
    gamification.equipAnimal('fox');
    expect(useGamificationStore.getState().equippedBati.animal).toBe('fox');
  });
});
