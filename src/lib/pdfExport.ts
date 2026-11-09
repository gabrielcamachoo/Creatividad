import { Subject } from '@/types';

/**
 * Abre una ventana emergente estilizada con la ficha de estudio de la materia
 * lista para imprimir en PDF o en papel mediante window.print().
 */
export function printSubjectCheatsheet(subject: Subject, studentName = 'Estudiante') {
  const redTopics = subject.topics.filter((t) => t.status === 'red');
  const yellowTopics = subject.topics.filter((t) => t.status === 'yellow');
  const greenTopics = subject.topics.filter((t) => t.status === 'green');

  const todayStr = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite ventanas emergentes para generar e imprimir tu ficha de estudio en PDF.');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha de Estudio · ${subject.name} (${subject.code})</title>
  <style>
    @page { size: letter; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.45;
      font-size: 11pt;
      margin: 0;
      padding: 10px;
    }
    .header {
      border-bottom: 2.5px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header h1 {
      margin: 0 0 4px 0;
      font-size: 20pt;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-red { background: #ffe4e6; color: #be123c; border: 1px solid #fecdd3; }
    .badge-yellow { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0284c7;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 9.5pt;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 800;
      margin: 18px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .topic-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .topic-name {
      font-weight: 700;
      font-size: 11pt;
    }
    .topic-notes {
      font-size: 9.5pt;
      color: #334155;
      background: #f1f5f9;
      padding: 8px 10px;
      border-radius: 6px;
      margin-top: 4px;
      white-space: pre-wrap;
    }
    .no-print-bar {
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-print {
      background: #10b981;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 10pt;
    }
    @media print {
      .no-print-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong>📄 Vista previa de Ficha de Estudio / Hoja de Fórmulas</strong>
      <div style="font-size: 8.5pt; opacity: 0.8;">Lista para imprimir en papel o guardar en PDF (Ctrl + P)</div>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar en PDF</button>
  </div>

  <div class="header">
    <div>
      <div style="font-size: 9pt; color: #64748b; font-weight: 700; text-transform: uppercase;">
        Pontificia Universidad Javeriana · MiSemáforo Quest
      </div>
      <h1>${subject.emoji || '📚'} ${subject.name}</h1>
      <div style="font-size: 9.5pt; color: #475569;">
        Código: <strong>${subject.code}</strong> · Semestre ${subject.semester || 1} · ${subject.credits || 3} Créditos
      </div>
    </div>
    <div style="text-align: right; font-size: 8.5pt; color: #64748b;">
      <div>Estudiante: <strong>${studentName}</strong></div>
      <div>Fecha: ${todayStr}</div>
      <div style="margin-top: 4px;">
        <span class="badge badge-green">${greenTopics.length} Dominados</span>
        <span class="badge badge-yellow">${yellowTopics.length} Práctica</span>
        <span class="badge badge-red">${redTopics.length} Urgentes</span>
      </div>
    </div>
  </div>

  ${
    subject.summary
      ? `<div class="summary-box">
          <strong>🎯 Objetivos del Sílabo / Resumen General:</strong>
          <div style="margin-top: 4px;">${subject.summary}</div>
        </div>`
      : ''
  }

  ${
    redTopics.length > 0
      ? `
    <div class="section-title" style="color: #be123c;">
      🔴 Temas Críticos / Vacíos a Atacar Primero (${redTopics.length})
    </div>
    ${redTopics
      .map(
        (t) => `
      <div class="topic-card" style="border-left: 4px solid #f43f5e;">
        <div class="topic-header">
          <span class="topic-name">${t.name}</span>
          <span class="badge badge-red">Prioridad Alta</span>
        </div>
        ${
          t.summary
            ? `<div class="topic-notes"><strong>Fórmula / Apunte Clave:</strong><br>${t.summary}</div>`
            : '<div style="font-size: 8.5pt; color: #94a3b8; font-style: italic;">Sin resumen registrado. Reforzar con Técnica Feynman.</div>'
        }
      </div>
    `
      )
      .join('')}
  `
      : ''
  }

  ${
    yellowTopics.length > 0
      ? `
    <div class="section-title" style="color: #b45309; margin-top: 24px;">
      🟡 Temas en Práctica / Por Pulir (${yellowTopics.length})
    </div>
    ${yellowTopics
      .map(
        (t) => `
      <div class="topic-card" style="border-left: 4px solid #f59e0b;">
        <div class="topic-header">
          <span class="topic-name">${t.name}</span>
          <span class="badge badge-yellow">Práctica</span>
        </div>
        ${
          t.summary
            ? `<div class="topic-notes"><strong>Fórmula / Apunte Clave:</strong><br>${t.summary}</div>`
            : ''
        }
      </div>
    `
      )
      .join('')}
  `
      : ''
  }

  ${
    greenTopics.length > 0
      ? `
    <div class="section-title" style="color: #15803d; margin-top: 24px;">
      🟢 Temas con Sello de Dominio (${greenTopics.length})
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
      ${greenTopics
        .map(
          (t) => `
        <div style="padding: 8px 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 9.5pt;">
          <strong>✓ ${t.name}</strong>
          ${t.summary ? `<div style="font-size: 8pt; color: #166534; margin-top: 2px;">${t.summary.slice(0, 90)}...</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `
      : ''
  }

  <div style="margin-top: 30px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 8.5pt; color: #94a3b8;">
    Generado con el Sistema de Batería y Semáforo de Estudio · MiSemáforo Quest
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
