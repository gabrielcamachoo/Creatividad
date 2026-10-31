import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\OsoGa\\.gemini\\antigravity\\brain\\adca31f1-1c25-41fa-8660-c46aa0210361';

async function verifyFinalExperience() {
  console.log('Iniciando verificación visual de Horario, Mascotas, Resúmenes, Tutorial y Motivación...');

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
      b.textContent && b.textContent.includes('Jugar con datos de ejemplo')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Abrir Horario de Clases
  console.log('2. Abriendo Horario de Clases...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent && b.textContent.includes('Horario')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_horario_semanal.png') });
  console.log('✓ Captura 12_horario_semanal.png guardada');

  // 3. Abrir Motivación Diaria
  console.log('3. Abriendo Modal de Motivación Diaria...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.title && b.title.includes('Inspiración y motivación diaria')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_motivacion_diaria.png') });
  console.log('✓ Captura 13_motivacion_diaria.png guardada');

  // Cerrar Motivación
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Cerrar modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 4. Abrir Tutorial Onboarding
  console.log('4. Abriendo Tutorial Guiado Onboarding...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.title && b.title.includes('Ver tutorial guiado')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '14_tutorial_onboarding.png') });
  console.log('✓ Captura 14_tutorial_onboarding.png guardada');

  // Cerrar Tutorial
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Cerrar tutorial"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 5. Ir a Perfil con Mascotas y Amigos
  console.log('5. Capturando Perfil con Mascotas y Compañeros de Estudio...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent && b.textContent.includes('Perfil')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '15_tienda_mascotas_amigos.png') });
  console.log('✓ Captura 15_tienda_mascotas_amigos.png guardada');

  await browser.close();
  console.log('Verificación completa finalizada con éxito.');
}

verifyFinalExperience().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
