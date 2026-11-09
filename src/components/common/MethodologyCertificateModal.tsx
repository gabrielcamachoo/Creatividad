import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Brain,
  BatteryCharging,
  Clock,
  Sparkles,
  FileText,
  Download,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEffects';

interface MethodologyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  careerOrGrade?: string;
}

export const MethodologyCertificateModal: React.FC<MethodologyCertificateModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Estudiante Javeriano',
  careerOrGrade = 'Pontificia Universidad Javeriana',
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'why_it_works' | 'scientific_basis'>('certificate');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrintCertificate = () => {
    soundEngine.playChestFanfare();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Calidad Metodológica · MiSemáforo</title>
  <style>
    @page { size: landscape; margin: 10mm; }
    body {
      font-family: 'Times New Roman', serif;
      background: #fafaf9;
      color: #1c1917;
      text-align: center;
      padding: 30px;
      margin: 0;
    }
    .cert-border {
      border: 8px double #0284c7;
      padding: 40px;
      background: white;
      border-radius: 12px;
      position: relative;
    }
    .watermark {
      font-size: 80pt;
      opacity: 0.04;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: sans-serif;
      font-weight: 900;
    }
    h1 { font-size: 28pt; color: #0369a1; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px; }
    h2 { font-size: 15pt; color: #44403c; font-style: italic; font-weight: normal; margin-bottom: 25px; }
    .student-name {
      font-size: 26pt;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 2px solid #0284c7;
      display: inline-block;
      padding: 0 30px 5px 30px;
      margin: 20px 0;
      font-family: sans-serif;
    }
    p { font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto 20px auto; color: #334155; }
    .seal-row {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 40px;
    }
    .seal {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px dashed #0284c7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      font-weight: bold;
      color: #0369a1;
      font-family: sans-serif;
    }
    .signature-line {
      width: 220px;
      border-top: 1px solid #78716c;
      font-size: 9pt;
      font-family: sans-serif;
      padding-top: 6px;
    }
  </style>
</head>
<body>
  <div class="cert-border">
    <div class="watermark">MISEMÁFORO</div>
    <div style="font-size: 11pt; letter-spacing: 3px; font-weight: bold; color: #d97706; margin-bottom: 10px;">
      ESTÁNDAR PEDAGÓGICO DE CIENCIA COGNITIVA & DESIGN THINKING
    </div>
    <h1>Certificación de Rigor Metodológico</h1>
    <h2>Sistema de Autoevaluación por Semáforo & Curva de Batería de 7 Días</h2>

    <p>Se certifica que la metodología de estudio aplicada por</p>
    <div class="student-name">${studentName}</div>
    <p>
      Vinculado a <strong>${careerOrGrade}</strong>, cuenta con la acreditación del método de
      <strong>Active Recall</strong> (Evocación Activa), <strong>Spaced Repetition</strong> (Repetición Espaciada mediante batería decreciente de 7 días)
      y el marco de resolución empática <strong>Design Thinking (Desafío 2)</strong>, erradicando el maratón pasivo y garantizando retención a largo plazo.
    </p>

    <div class="seal-row">
      <div>
        <div class="signature-line">
          <strong>Gabriel Camacho</strong><br>
          Modelado & Metodología Cognitiva
        </div>
      </div>

      <div class="seal">
        <span style="font-size: 20pt;">🚦</span>
        CALIDAD<br>VERIFICADA
      </div>

      <div>
        <div class="signature-line">
          <strong>Fecha de Emisión</strong><br>
          ${todayStr}
        </div>
      </div>
    </div>
  </div>
  <script>window.print();</script>
</body>
</html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 grid place-items-center text-xl sm:text-2xl shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Garantía Científica & Pedagógica
              </span>
              <h2 className="text-lg sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
                Certificación Semáforo + Batería 🏅
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 gap-2 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`py-3 px-3 text-xs font-heading font-black border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'certificate'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificado Imprimible</span>
          </button>

          <button
            onClick={() => setActiveTab('why_it_works')}
            className={`py-3 px-3 text-xs font-heading font-black border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'why_it_works'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>¿Por qué es tan bueno?</span>
          </button>

          <button
            onClick={() => setActiveTab('scientific_basis')}
            className={`py-3 px-3 text-xs font-heading font-black border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'scientific_basis'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Base Científica & Origen</span>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'certificate' && (
            <div className="space-y-5 text-center">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-amber-500/40 relative">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                  ESTÁNDAR OFICIAL DE CALIDAD DE APRENDIZAJE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
                  Acreditación de Metodología de Estudio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Otorga certificación al estudiante por adoptar la autoevaluación honesta y el control de la curva del olvido.
                </p>

                <div className="py-2 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 inline-block shadow-sm">
                  <span className="text-sm sm:text-base font-heading font-black text-emerald-600 dark:text-emerald-400">
                    🎓 {studentName}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {careerOrGrade}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-6 text-left">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <strong className="text-emerald-700 dark:text-emerald-300 block mb-0.5">🚦 Semáforo Honesto</strong>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Evidencia real: no marcar Verde si no eres capaz de resolverlo sin apuntes.
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
                    <strong className="text-blue-700 dark:text-blue-300 block mb-0.5">🔋 Batería de 7 Días</strong>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Previene el olvido con micro-repasos programados cada 7 días continuos.
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs">
                    <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">🧠 Active Recall</strong>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Comprobado: recordar activamente es 3 veces más eficaz que releer pasivamente.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="btn-game px-6 py-3 rounded-2xl text-xs font-heading font-black text-white bg-amber-500 hover:bg-amber-400 shadow-glow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar / Imprimir Certificado Oficial en PDF</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'why_it_works' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h4 className="font-heading font-black text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¿Por qué este método supera el estudio tradicional de maratón?</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  El 80% de los estudiantes universitarios caen en la trampa de la <strong>"ilusión de competencia"</strong>:
                  creen que porque entienden al profesor en clase o porque tienen bonitos apuntes en el iPad o cuaderno,
                  ya dominan el tema. Cuando llega el parcial, no recuerdan los pasos.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="card p-4 space-y-1.5 border-l-4 border-rose-500">
                  <span className="font-heading font-black text-rose-600 dark:text-rose-400 block">
                    ❌ El Error Tradicional: Relectura Pasiva
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Sentarse a leer 40 hojas la noche anterior. La curva del olvido borra el 70% en 48 horas,
                    generando estrés, fatiga mental y notas impredecibles.
                  </p>
                </div>

                <div className="card p-4 space-y-1.5 border-l-4 border-emerald-500">
                  <span className="font-heading font-black text-emerald-600 dark:text-emerald-400 block">
                    ✓ La Solución MiSemáforo: Ataque Dirigido
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    El sistema te obliga a mirar solo tus <strong>Rojos</strong> (vacíos críticos) y <strong>Baterías en 1 bloque</strong>.
                    Estudias 25 minutos diarios con alta densidad cognitiva en vez de 6 horas desesperadas.
                  </p>
                </div>
              </div>

              <div className="card p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="font-heading font-black text-xs text-slate-900 dark:text-white">
                  Los 3 Pilares del Éxito:
                </h5>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                  <li><strong>Foco en debilidades:</strong> Nunca repasas lo que ya sabes; priorizas los temas que te harían perder el parcial.</li>
                  <li><strong>Batería de 7 días:</strong> La repetición espaciada refuerza las sinapsis neuronales justo en el umbral del olvido.</li>
                  <li><strong>Gamificación saludable:</strong> Mascotas, Voltios y escudos para que el estudio sea un hábito gratificante, no una obligación pesada.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'scientific_basis' && (
            <div className="space-y-4">
              <div className="card p-5 space-y-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Historia & Proceso de Creación
                </span>
                <h4 className="font-heading font-black text-base text-slate-900 dark:text-white">
                  ¿Cómo nació MiSemáforo? · Desafío 2 de Design Thinking
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Nació en la <strong>Pontificia Universidad Javeriana</strong> tras entrevistar a profundidad a 4 estudiantes con distintos métodos de estudio (cuadernos físicos, iPads, carpetas compartidas y notas de voz). Descubrimos que el problema real no era "dónde tomar apuntes", sino <strong>la falta de continuidad y el no saber con honestidad qué se dominaba y qué se estaba olvidando fuera del aula</strong>.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="card p-4 space-y-1">
                  <span className="text-xl">📉</span>
                  <h5 className="font-heading font-black text-slate-900 dark:text-white">Curva de Ebbinghaus</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Hermann Ebbinghaus demostró en 1885 que sin repasos periódicos, el cerebro descarta la información no utilizada. La batería de 7 días es la traducción visual moderna de este principio.
                  </p>
                </div>

                <div className="card p-4 space-y-1">
                  <span className="text-xl">💡</span>
                  <h5 className="font-heading font-black text-slate-900 dark:text-white">Efecto Testing</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Roediger & Karpicke (2006) probaron que evaluarse a uno mismo genera un 50% más de retención duradera que volver a leer los mismos textos.
                  </p>
                </div>

                <div className="card p-4 space-y-1">
                  <span className="text-xl">🧩</span>
                  <h5 className="font-heading font-black text-slate-900 dark:text-white">Fórmula WOW Design Thinking</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    De 100 ideas generadas con SCAMPER y conexiones visuales, el Semáforo + Batería obtuvo puntaje perfecto (12/12) y 5.0 en impacto en la matriz WOW.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <span className="text-[11px] text-slate-400 font-bold">
            Metodología Oficial · Pontificia Universidad Javeriana
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-game px-5 py-2 rounded-xl text-xs font-black text-white bg-slate-900 dark:bg-white dark:text-slate-900"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
