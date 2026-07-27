/* 카카오톡/SNS 공유 썸네일(public/og-image.png, 1200x630)을 재생성한다.
 * 문구나 디자인이 바뀌면 scripts/og-image-template.html 을 고친 뒤 재실행.
 *
 * Playwright로 템플릿 HTML을 그대로 스크린샷 찍는 방식이라 economing의
 * package.json에는 아무 의존성도 추가되지 않는다. 이 환경에서는
 * C:\Users\1\node_modules\playwright 를 공유해서 쓰고 있어 별도 설치가
 * 필요 없지만, 없는 환경이라면 실행 전 한 번 설치한다:
 *   npm install --no-save --no-package-lock playwright
 *   node scripts/generate-og-image.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(__dirname, 'og-image-template.html');
const ICON = path.join(ROOT, 'public', 'appicon.jpg');
const OUT = path.join(ROOT, 'public', 'og-image.png');

const iconDataUri = 'data:image/jpeg;base64,' + fs.readFileSync(ICON).toString('base64');
const html = fs.readFileSync(TEMPLATE, 'utf-8').replace('APPICON_DATA_URI', iconDataUri);

const tmpHtml = path.join(__dirname, '_og-image-render.html');
fs.writeFileSync(tmpHtml, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + tmpHtml.replace(/\\/g, '/'));
await page.waitForTimeout(500); // 웹폰트 로드 대기
await page.screenshot({ path: OUT });
await browser.close();

fs.unlinkSync(tmpHtml);
console.log('written', OUT);
