// node tools/make-images.js  -> regenerates all placeholder images in /img
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const { PRODUCTS, EMOJI } = new Function(src + '; return {PRODUCTS, EMOJI};')();
const G = '#95CA31', D = '#1A1A1A', L = '#EAF5D3', P = '#6B3FA0';
const PAL = [[G, D], [D, G], [L, D], [P, G]];
const esc = t => t.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
const w = (f, t) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); };
PRODUCTS.forEach(p => {
  PAL.forEach(([bg, fg], i) => {
    const em = EMOJI[p.cat] || '👟';
    const words = esc(p.name.replace('Kicksglow ', '').split(' ').slice(0, 4).join(' '));
    const sz = [150, 120, 170, 140][i], dx = [0, -30, 20, 0][i];
    w(path.join(root, `img/products/${p.id}-${i + 1}.svg`),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${bg}"/><circle cx="${330 + dx}" cy="70" r="90" fill="${fg}" opacity=".08"/><circle cx="60" cy="350" r="70" fill="${fg}" opacity=".06"/><text x="${200 + dx}" y="215" font-size="${sz}" text-anchor="middle">${em}</text><text x="200" y="320" font-family="Arial" font-weight="800" font-size="20" text-anchor="middle" fill="${fg}" letter-spacing="3">KICKSGLOW</text><text x="200" y="348" font-family="Arial" font-size="14" text-anchor="middle" fill="${fg}" opacity=".75">${words}</text></svg>`);
  });
});
const big = (f, bg, fg, em, txt) => w(path.join(root, f),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" rx="40" fill="${bg}"/><circle cx="300" cy="290" r="220" fill="${fg}" opacity=".1"/><text x="300" y="360" font-size="260" text-anchor="middle">${em}</text><text x="300" y="540" font-family="Arial" font-weight="800" font-size="30" text-anchor="middle" fill="${fg}" letter-spacing="6">${txt}</text></svg>`);
big('img/hero/promo.svg', D, G, '✨', 'CLEAN • PROTECT • STORE');
big('img/about/story.svg', G, D, '👟', 'OUR STORY');
big('img/about/feature.svg', P, G, '🛡️', 'BUILT FOR EVERY STEP');
console.log('images done');
