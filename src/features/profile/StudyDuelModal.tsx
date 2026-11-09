import React, { useState, useEffect } from 'react';
import { Friend, Subject } from '@/types';
import { soundEngine } from '@/lib/soundEffects';
import { useGamificationStore } from '@/store/useGamificationStore';
import {
  Swords,
  X,
  Trophy,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';

interface StudyDuelModalProps {
  friend: Friend;
  subjects: Subject[];
  isOpen: boolean;
  onClose: () => void;
}

interface DuelQuestion {
  subjectName: string;
  topicName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const StudyDuelModal: React.FC<StudyDuelModalProps> = ({
  friend,
  subjects,
  isOpen,
  onClose,
}) => {
  const { addXP, addVolts } = useGamificationStore();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [friendScore, setFriendScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);

  // Generar preguntas dinámicas basadas en los temas reales de las materias
  const questions: DuelQuestion[] = React.useMemo(() => {
    const list: DuelQuestion[] = [];
    const allTopics = subjects.flatMap((s) =>
      s.topics.map((t) => ({ ...t, subjectName: s.name, subjectEmoji: s.emoji || '📚' }))
    );

    if (allTopics.length === 0) {
      return [
        {
          subjectName: 'Metodología MiSemáforo',
          topicName: 'Curva del Olvido',
          question: '¿Cuántos días dura la batería fresca antes de perder el primer bloque?',
          options: ['3 días', '7 días', '14 días', '21 días'],
          correctIndex: 1,
          explanation: 'La batería pierde 1 bloque cada 7 días para prevenir la curva del olvido de Ebbinghaus.',
        },
        {
          subjectName: 'Técnicas de Estudio',
          topicName: 'Técnica Feynman',
          question: '¿Cuál es el núcleo principal de la Técnica Feynman?',
          options: [
            'Copiar el libro de texto a mano tres veces',
            'Explicar el concepto en lenguaje simple como a un niño',
            'Memorizar sin comprender la demostración',
            'Estudiar solo la noche anterior al examen',
          ],
          correctIndex: 1,
          explanation: 'Feynman demostró que si no puedes explicarlo simple, aún tienes vacíos.',
        },
      ];
    }

    // Tomar hasta 5 temas aleatorios
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random()).slice(0, 5);

    shuffled.forEach((t) => {
      list.push({
        subjectName: t.subjectName,
        topicName: t.name,
        question: `En ${t.subjectName}, ¿cuál es el enfoque clave para dominar el tema "${t.name}"?`,
        options: [
          `Resolver ejercicios prácticos y poder explicarlo sin mirar cuaderno (${t.name})`,
          'Leer el título por encima y dejarlo en Rojo',
          'Esperar hasta el día del examen final para repasarlo',
          'Aprenderse solo la respuesta de memoria sin fórmula',
        ],
        correctIndex: 0,
        explanation: `El Sello de Dominio (Verde) en "${t.name}" se logra con Active Recall y resolución autónoma.`,
      });
    });

    return list;
  }, [subjects, isOpen]);

  // Reloj de pregunta
  useEffect(() => {
    if (gameState !== 'playing' || isAnswerRevealed) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          handleSelectAnswer(-1); // Tiempo agotado
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isAnswerRevealed, currentIdx]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || questions[0];

  const handleStart = () => {
    soundEngine.playPop();
    setGameState('playing');
    setCurrentIdx(0);
    setUserScore(0);
    setFriendScore(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setSecondsLeft(15);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(optionIndex);
    setIsAnswerRevealed(true);

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      soundEngine.playSuccessChime();
      setUserScore((s) => s + 100 + secondsLeft * 5);
    } else {
      soundEngine.playPop();
    }

    // Simulación del amigo (IA adaptativa según nivel del amigo)
    const friendAccuracy = Math.min(0.85, 0.45 + friend.level * 0.08);
    const friendGotItRight = Math.random() < friendAccuracy;
    if (friendGotItRight) {
      const friendTime = Math.floor(Math.random() * 8) + 4;
      setFriendScore((s) => s + 100 + friendTime * 5);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setSecondsLeft(15);
      soundEngine.playPop();
    } else {
      // Final del duelo
      setGameState('finished');
      soundEngine.playChestFanfare();
      const didWin = userScore >= friendScore;
      addXP(didWin ? 80 : 35);
      addVolts(didWin ? 20 : 8);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Cabecera */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-500 grid place-items-center text-xl shrink-0">
              <Swords className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">
                Arena de Duelos Javerianos
              </span>
              <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                Duelo de Repaso vs {friend.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pantalla 1: INTRODUCCIÓN */}
        {gameState === 'intro' && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 grid place-items-center text-3xl mx-auto shadow-md">
                  🎓
                </div>
                <span className="text-xs font-bold mt-2 block text-slate-900 dark:text-white">Tú</span>
              </div>

              <span className="font-heading font-black text-2xl text-rose-500 animate-pulse">VS</span>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500 grid place-items-center text-3xl mx-auto shadow-md">
                  {friend.equippedAnimal || '🦉'}
                </div>
                <span className="text-xs font-bold mt-2 block text-slate-900 dark:text-white truncate max-w-[100px]">
                  {friend.name}
                </span>
                <span className="text-[10px] text-slate-400">Nv. {friend.level}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                5 Preguntas Relámpago de tus Materias
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Pon a prueba tu agilidad mental frente a tu compañero. 15 segundos por pregunta. ¡Gana el que más puntos sume!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Premio: +80 XP y +20 Voltios ⚡ por victoria</span>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="btn-game w-full py-3.5 rounded-2xl text-sm font-heading font-black text-white bg-rose-500 hover:bg-rose-400 shadow-glow"
            >
              ¡Comenzar Duelo Ahora! ⚔️
            </button>
          </div>
        )}

        {/* Pantalla 2: EN JUEGO */}
        {gameState === 'playing' && (
          <div className="p-6 space-y-5">
            {/* Marcador Superior */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block">Tú</span>
                <span className="text-base font-mono font-black text-emerald-500">{userScore} pts</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <Timer className="w-4 h-4 text-amber-500" />
                <span
                  className={`font-mono text-sm font-black ${
                    secondsLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {secondsLeft}s
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block truncate max-w-[90px]">
                  {friend.name}
                </span>
                <span className="text-base font-mono font-black text-indigo-400">{friendScore} pts</span>
              </div>
            </div>

            {/* Pregunta */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>PREGUNTA {currentIdx + 1} DE {questions.length}</span>
                <span className="text-sky-500 font-bold">{currentQ.subjectName}</span>
              </div>
              <h4 className="font-heading font-black text-base text-slate-900 dark:text-white">
                {currentQ.question}
              </h4>
            </div>

            {/* Opciones */}
            <div className="space-y-2">
              {currentQ.options.map((opt, i) => {
                let btnCls = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                if (isAnswerRevealed) {
                  if (i === currentQ.correctIndex) {
                    btnCls = 'bg-emerald-500 text-white border-emerald-500 shadow-sm';
                  } else if (i === selectedOption) {
                    btnCls = 'bg-rose-500 text-white border-rose-500';
                  } else {
                    btnCls = 'opacity-40 border-transparent';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isAnswerRevealed}
                    onClick={() => handleSelectAnswer(i)}
                    className={`w-full p-3 rounded-2xl text-left text-xs font-bold border transition-all flex items-center justify-between gap-2 ${btnCls}`}
                  >
                    <span>{opt}</span>
                    {isAnswerRevealed && i === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                    )}
                    {isAnswerRevealed && i === selectedOption && i !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 shrink-0 text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explicación y Siguiente */}
            {isAnswerRevealed && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-scale-up">
                <p>
                  <strong>💡 Clave conceptual:</strong> {currentQ.explanation}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-game px-4 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    {currentIdx + 1 < questions.length ? 'Siguiente Pregunta →' : 'Ver Resultados Finales 🏆'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pantalla 3: RESULTADOS */}
        {gameState === 'finished' && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-500 grid place-items-center text-4xl mx-auto animate-float">
              {userScore >= friendScore ? '🏆' : '🤝'}
            </div>

            <div>
              <h4 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                {userScore > friendScore
                  ? '¡Victoria Épica! 👑'
                  : userScore === friendScore
                  ? '¡Empate Técnico! ⚖️'
                  : '¡Buen intento! 💪'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {userScore >= friendScore
                  ? `Demostraste mayor dominio de los conceptos que ${friend.name}.`
                  : `${friend.name} estuvo muy veloz hoy. ¡Repasa tus temas rojos y pide la revancha!`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-white/10 flex items-center justify-around">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Tu Puntaje</span>
                <span className="text-2xl font-mono font-black text-emerald-400">{userScore}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">{friend.name}</span>
                <span className="text-2xl font-mono font-black text-indigo-400">{friendScore}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStart}
                className="btn-game flex-1 py-3 rounded-2xl text-xs font-heading font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                Jugar Revancha 🔄
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-game flex-1 py-3 rounded-2xl text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-400"
              >
                Cerrar y Reclamar Recompensas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
