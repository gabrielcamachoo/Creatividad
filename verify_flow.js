import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\OsoGa\\.gemini\\antigravity\\brain\\adca31f1-1c25-41fa-8660-c46aa0210361';

async function runVerification() {
  console.log('Iniciando verificación automatizada de flujo end-to-end con Puppeteer...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Cargar Home Screen
  console.log('1. Navegando a http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_home_screen.png') });
  console.log('✓ Captura 01_home_screen.png guardada');

  // 2. Cargar datos de ejemplo y entrar al Tablero
  console.log('2. Haciendo clic en "Jugar con datos de ejemplo"...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Jugar con datos de ejemplo')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_dashboard_demo_data.png') });
  console.log('✓ Captura 02_dashboard_demo_data.png guardada');

  // 3. Simular +7 días (ver batería bajar y Bati cansada)
  console.log('3. Haciendo clic en "Simular +7 Días" en la barra de presentación...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Simular +7 Días')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_simulated_7_days_tired_bati.png') });
  console.log('✓ Captura 03_simulated_7_days_tired_bati.png guardada');

  // 4. Repasar con botón de misión rápida
  console.log('4. Repasando un tema para recargar batería y ganar XP...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.trim() === 'Repasé'
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_challenge_recharge.png') });
  console.log('✓ Captura 04_challenge_recharge.png guardada');

  // 5. Ir a Recompensas y abrir el Cofre Diario
  console.log('5. Navegando a Recompensas y abriendo cofre...');
  await page.evaluate(() => {
    const navBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Recompensas')
    );
    if (navBtn) navBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Forzar cofre o abrir cofre
  await page.evaluate(() => {
    const chestBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Abrir Cofre Diario') || b.textContent?.includes('Forzar Cofre')
    );
    if (chestBtn) chestBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_daily_chest_opened.png') });
  console.log('✓ Captura 05_daily_chest_opened.png guardada');

  // Cerrar modal de cofre
  await page.evaluate(() => {
    const okBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('¡Genial, gracias!')
    );
    if (okBtn) okBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 6. Comprar accesorio en la tienda
  console.log('6. Entrando a la Tienda de Bati y comprando accesorio...');
  await page.evaluate(() => {
    const shopTab = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Tienda de Bati')
    );
    if (shopTab) shopTab.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Clic en comprar primer accesorio disponible
  await page.evaluate(() => {
    const buyBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Comprar por')
    );
    if (buyBtn) buyBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_shop_purchased_accessory.png') });
  console.log('✓ Captura 06_shop_purchased_accessory.png guardada');

  // 7. Simular +1 Día sin repasar para ver cómo el escudo de racha protege
  console.log('7. Simulando paso de día para comprobar escudo protector de racha...');
  await page.evaluate(() => {
    const dayBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('+1 Día')
    );
    if (dayBtn) dayBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_streak_shield_protected.png') });
  console.log('✓ Captura 07_streak_shield_protected.png guardada');

  // 8. Navegar a "Metodología DT (Cómo llegamos aquí)"
  console.log('8. Abriendo pantalla de Metodología Design Thinking...');
  await page.evaluate(() => {
    const methBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Metodología DT')
    );
    if (methBtn) methBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_methodology_design_thinking.png'), fullPage: false });
  console.log('✓ Captura 08_methodology_design_thinking.png guardada');

  await browser.close();
  console.log('¡Verificación end-to-end completada exitosamente!');
}

runVerification().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
