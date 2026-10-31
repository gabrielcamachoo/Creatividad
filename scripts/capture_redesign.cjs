const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\OsoGa\\.gemini\\antigravity\\brain\\adca31f1-1c25-41fa-8660-c46aa0210361';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });

  // 1. Dashboard screenshot
  await page.waitForSelector('h1, h2');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_01_dashboard.png') });
  console.log('Captured redesign_01_dashboard.png');

  // 2. Horario
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Horario')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_02_schedule.png') });
  console.log('Captured redesign_02_schedule.png');

  // 3. Plan / Priorizador
  const buttons2 = await page.$$('button');
  for (const btn of buttons2) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Reporte') || text.includes('Prioridad') || text.includes('Plan'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_03_study_report.png') });
  console.log('Captured redesign_03_study_report.png');

  // 4. Premios / Tienda
  const buttons3 = await page.$$('button');
  for (const btn of buttons3) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Premios') || text.includes('Recompensas'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  // Switch to shop tab
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Mascotas')) {
      await tab.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_04_pets_shop.png') });
  console.log('Captured redesign_04_pets_shop.png');

  // 5. Perfil
  const buttons4 = await page.$$('button');
  for (const btn of buttons4) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Perfil')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'redesign_05_profile_friends.png') });
  console.log('Captured redesign_05_profile_friends.png');

  await browser.close();
  console.log('Finished capturing redesign screenshots successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
