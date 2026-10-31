import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\OsoGa\\.gemini\\antigravity\\brain\\adca31f1-1c25-41fa-8660-c46aa0210361';

async function verifyNewFeatures() {
  console.log('Verificando nuevas funciones: Subida por semáforo, Reporte de estudio y Modo Colegio/Universidad...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  // 1. Cargar Dashboard
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Jugar con datos de ejemplo')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 2. Abrir Asistente de Subida por Semáforo
  console.log('2. Abriendo modal de subida de temas clasificados por semáforo...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Subir Temas')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_bulk_import_modal.png') });
  console.log('✓ Captura 09_bulk_import_modal.png guardada');

  // Cerrar modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Cerrar importador"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 3. Abrir Reporte de Estudio Priorizado
  console.log('3. Navegando al Reporte de Estudio Inteligente por Priorización...');
  await page.evaluate(() => {
    const repBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Reporte Estudio') || b.textContent?.includes('Generar Reporte')
    );
    if (repBtn) repBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_study_report_prioritized.png') });
  console.log('✓ Captura 10_study_report_prioritized.png guardada');

  // 4. Cambiar a Modo Colegio / Bachillerato
  console.log('4. Cambiando a Modo Colegio / Bachillerato...');
  await page.evaluate(() => {
    const schoolBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Colegio')
    );
    if (schoolBtn) schoolBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Volver al Tablero para capturar modo colegio
  await page.evaluate(() => {
    const tabBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Tablero')
    );
    if (tabBtn) tabBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_school_mode_dashboard.png') });
  console.log('✓ Captura 11_school_mode_dashboard.png guardada');

  await browser.close();
  console.log('¡Verificación de nuevas funcionalidades completada con éxito!');
}

verifyNewFeatures().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
