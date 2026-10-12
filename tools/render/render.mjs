import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
import fs from 'fs';
const jobs = JSON.parse(process.argv[2]);
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('console', m => console.log('console:', m.text()));
await page.goto('file://' + process.cwd() + '/render.html');
for (const j of jobs) {
  const t = Date.now();
  const url = await page.evaluate(([m,w,h,s]) => window.render(m,w,h,s), [j.mode, j.w, j.h, j.seed||0]);
  fs.writeFileSync(j.out, Buffer.from(url.split(',')[1], 'base64'));
  console.log(j.out, (Date.now()-t)+'ms');
}
await browser.close();
