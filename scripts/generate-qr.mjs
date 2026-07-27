/* 배포 URL이 바뀌면 재실행: public/qr-mobile.png 를 다시 생성한다.
 * qrcode는 런타임 의존성이 아니라 실행 전 임시 설치가 필요하다:
 *   npm install --no-save --no-package-lock qrcode
 *   node scripts/generate-qr.mjs
 *   npm uninstall qrcode --no-save   (또는 node_modules/qrcode 수동 삭제)
 */
import QRCode from 'qrcode';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPLOY_URL = 'https://namong118.github.io/economing/';
const OUT = path.join(__dirname, '..', 'public', 'qr-mobile.png');

await QRCode.toFile(OUT, DEPLOY_URL, {
  type: 'png',
  width: 512,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: { dark: '#000000', light: '#FFFFFF' },
});

console.log('written', OUT);
