import React, { useState, useEffect } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { api, StudyReportResponse } from '@/lib/api';
import { calculatePrioritizedTopics } from '@/lib/studyEngine';
import { BatteryBar } from '@/components/common/BatteryBar';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  GraduationCap,
  School,
  Zap,
} from 'lucide-react';

export const StudyReportScreen: React.FC = () => {
  const { subjects } = useStudyStore();
  const { getSimulatedDateStr } = useTimeStore();
  const { studentLevel, setActiveView } = useSettingsStore();

  const [reportData, setReportData] = useState<StudyReportResponse | null>(null);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentDateStr = getSimulatedDateStr();

  useEffect(() => {
    let isMounted = true;
    async function loadReport() {
      try {
        const data = await api.getStudyReport(currentDateStr);
        if (isMounted) setReportData(data);
      } catch (err) {
        const allTopics = subjects.flatMap((s) => s.topics);
        const prioritized = calculatePrioritizedTopics(subjects, currentDateStr);
        const pendingTopics = prioritized.filter(
          (item) => item.topic.status === 'red' || item.topic.status === 'yellow' || item.batteryBlocks === 0
        );

        const redCount = allTopics.filter((t) => t.status === 'red').length;
        const yellowCount = allTopics.filter((t) => t.status === 'yellow').length;
        const greenCount = allTopics.filter((t) => t.status === 'green').length;
        const total = allTopics.length;
        const masteryPercentage = total > 0 ? Math.round((greenCount / total) * 100) : 0;
        const estimatedHours = Math.ceil((redCount * 45 + yellowCount * 25) / 60);

        const actionPlan = pendingTopics.map((p, index) => {
          const isRed = p.topic.status === 'red';
          return {
            order: index + 1,
            topicName: p.topic.name,
            subjectName: p.subjectName,
            subjectCode: p.subjectCode,
            status: p.topic.status,
            batteryBlocks: p.batteryBlocks,
            daysSinceReview: p.daysSinceReview,
            priorityLevel: isRed ? 'Urgencia Máxima (Vacío Crítico)' : 'Prioridad Media (Consolidación)',
            estimatedMinutes: isRed ? 45 : 25,
            suggestedMethod: isRed
              ? 'Técnica Feynman: explícalo con palabras sencillas.'
              : 'Active Recall: 3 a 5 ejercicios prácticos.',
            studyTips: isRed
              ? ['Video explicativo de 5 min', 'Anota tu propia definición', 'Hazte 1 pregunta clave']
              : ['Ficha de memoria rápida', '2 ejercicios tipo examen', 'Repasa fórmulas clave'],
          };
        });

        if (isMounted) {
          setReportData({
            generatedAt: new Date().toISOString(),
            studentProfile: {
              level: studentLevel,
              gradeOrCareer: studentLevel === 'school' ? 'Colegio / Bachillerato' : 'Universidad / Pregrado',
              name: 'Estudiante',
            },
            summary: {
              totalTopics: total,
              greenCount,
              yellowCount,
              redCount,
              masteryPercentage,
              pendingActionCount: pendingTopics.length,
              estimatedHoursToMasterAll: estimatedHours,
            },
            diagnosticMessage:
              masteryPercentage >= 75
                ? '¡Buen ritmo! Solo ataca estos vacíos puntuales para asegurar notas sobresalientes.'
                : 'Tienes vacíos conceptuales que requieren tu atención. Sigue este orden de ataque para no saturarte.',
            actionPlan,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReport();
    return () => {
      isMounted = false;
    };
  }, [subjects, currentDateStr, studentLevel]);

  const toggleTopicCheck = (topicName: string) => {
    if (completedTopicIds.includes(topicName)) {
      setCompletedTopicIds(completedTopicIds.filter((t) => t !== topicName));
    } else {
      setCompletedTopicIds([...completedTopicIds, topicName]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!reportData) return;
    const text = `# 🚦 REPORTE DE ESTUDIO INTELIGENTE POR PRIORIZACIÓN
Generado: ${new Date().toLocaleDateString('es-CO')}
Nivel: ${studentLevel === 'school' ? 'Colegio / Bachillerato' : 'Universidad / Pregrado'}

## 📊 Diagnóstico
- Total de conceptos: ${reportData.summary.totalTopics}
- Dominados: ${reportData.summary.greenCount} (${reportData.summary.masteryPercentage}%)
- En práctica (Amarillo): ${reportData.summary.yellowCount}
- Vacíos críticos (Rojo): ${reportData.summary.redCount}
- Tiempo de estudio estimado: ~${reportData.summary.estimatedHoursToMasterAll} horas

## 🎯 Plan de Ataque Priorizado:
${reportData.actionPlan
  .map(
    (item) => `### ${item.order}. ${item.topicName} [${item.subjectName}]
- Urgencia: ${item.priorityLevel} (~${item.estimatedMinutes} min)
- Método: ${item.suggestedMethod}
- Acciones:
  ${(item.studyTips || []).map((tip) => `- [ ] ${tip}`).join('\n  ')}
`
  )
  .join('\n')}
---
Generado por MiSemaforo.`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-heading font-black text-sm text-slate-700 dark:text-slate-300">
          Calculando tu plan de estudio inteligente...
        </p>
      </div>
    );
  }

  if (!reportData || reportData.actionPlan.length === 0) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center animate-fade-in">
        <div className="card p-10 space-y-4">
          <div className="text-5xl animate-bounce">🎉</div>
          <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
            ¡Semáforo en Verde Absoluto!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            No tienes vacíos críticos ni temas en amarillo pendientes de repasar. Tus baterías están al 100%.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="btn-game px-5 py-2.5 bg-emerald-500 text-white text-xs font-black rounded-2xl"
            >
              Volver al Tablero
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { summary, actionPlan } = reportData;

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-5xl mx-auto px-4 sm:px-6 text-left animate-fade-in print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Flame className="w-3.5 h-3.5" />
              <span>Diagnóstico Automático</span>
            </span>
            <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {studentLevel === 'school' ? '🏫 Bachillerato' : '🎓 Universidad'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
            Plan de Ataque Priorizado 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Estudia en este orden exacto: primero rojos (vacíos), luego amarillos con batería baja.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 print:hidden shrink-0">
          <button
            onClick={handleCopyMarkdown}
            className="btn-game px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            title="Copiar plan a Notion / Portapapeles"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-black">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Plan</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="btn-game px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="w-4 h-4" />
            <span>PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {/* Tarjeta Bento de Resumen Estratégico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4 border-rose-500/30 bg-rose-500/5">
          <span className="text-2.5xs uppercase font-black tracking-wider text-rose-600 dark:text-rose-400">
            🔴 Vacíos Críticos
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-black text-rose-600 dark:text-rose-400 mt-1">
            {summary.redCount}
          </p>
          <span className="text-2.5xs text-slate-500">Urgencia #1</span>
        </div>

        <div className="card p-4 border-amber-500/30 bg-amber-500/5">
          <span className="text-2.5xs uppercase font-black tracking-wider text-amber-600 dark:text-amber-400">
            🟡 Falta Práctica
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-black text-amber-600 dark:text-amber-400 mt-1">
            {summary.yellowCount}
          </p>
          <span className="text-2.5xs text-slate-500">Consolidación</span>
        </div>

        <div className="card p-4 border-emerald-500/30 bg-emerald-500/5">
          <span className="text-2.5xs uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400">
            🟢 Dominados
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.greenCount}
          </p>
          <span className="text-2.5xs text-slate-500">{summary.masteryPercentage}% del total</span>
        </div>

        <div className="card p-4 border-blue-500/30 bg-blue-500/5">
          <span className="text-2.5xs uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
            ⏱️ Tiempo Sugerido
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-black text-blue-600 dark:text-blue-400 mt-1">
            ~{summary.estimatedHoursToMasterAll}h
          </p>
          <span className="text-2.5xs text-slate-500">Para dominar todo</span>
        </div>
      </div>

      {/* Lista del Plan de Ataque (Checklist Interactivo) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Misiones Prioritarias ({actionPlan.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            {completedTopicIds.length} de {actionPlan.length} completados
          </span>
        </div>

        <div className="space-y-3">
          {actionPlan.map((item) => {
            const isCompleted = completedTopicIds.includes(item.topicName);
            const isRed = item.status === 'red';

            return (
              <div
                key={item.order}
                className={`card p-4 sm:p-5 transition-all ${
                  isCompleted
                    ? 'opacity-60 bg-slate-50 dark:bg-slate-800/40 line-through-label'
                    : isRed
                    ? 'border-2 border-rose-500/30 bg-rose-500/5'
                    : 'border border-amber-500/30 bg-amber-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox táctil */}
                    <button
                      type="button"
                      onClick={() => toggleTopicCheck(item.topicName)}
                      className="mt-0.5 p-1 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                      aria-label="Marcar como estudiado"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`font-heading font-black text-2.5xs px-2 py-0.5 rounded-md ${
                            isRed
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-400 text-amber-950 font-black'
                          }`}
                        >
                          #{item.order} · {item.priorityLevel}
                        </span>
                        <span className="font-mono text-2.5xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.subjectCode} · {item.subjectName}
                        </span>
                        <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 text-2.5xs">
                          <Clock className="w-3 h-3" />
                          <span>~{item.estimatedMinutes} min</span>
                        </span>
                      </div>

                      <h3
                        className={`text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {item.topicName}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        💡 <strong>Técnica sugerida:</strong> {item.suggestedMethod}
                      </p>

                      {/* Micro tips */}
                      {item.studyTips && item.studyTips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {item.studyTips.map((tip, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-2.5xs font-bold text-slate-700 dark:text-slate-300"
                            >
                              ✓ {tip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 hidden sm:block">
                    <BatteryBar blocks={item.batteryBlocks} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
