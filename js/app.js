/* Kicksglow – shared layout, cart and page logic (no backend needed) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const INR = n => '₹' + Math.round(n).toLocaleString('en-IN');
const byId = id => PRODUCTS.find(p => p.id === id);
const off = p => Math.round((1 - p.price / p.mrp) * 100);
const PACKS = [
  { n: 1, label: 'Pack of 1', mult: 1,   badge: '' },
  { n: 2, label: 'Pack of 2', mult: 1.8, badge: 'Best Seller' },
  { n: 4, label: 'Pack of 4', mult: 3.2, badge: 'Best Value' }
];
const packPrice = (p, n) => Math.round(p.price * PACKS.find(k => k.n === n).mult);
const packMrp = (p, n) => Math.round(p.mrp * PACKS.find(k => k.n === n).mult * 1.0);

/* ---------- cart ---------- */
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem('kg_cart')) || []; } catch (e) { return []; } },
  set(c) { try { localStorage.setItem('kg_cart', JSON.stringify(c)); } catch (e) {} renderCart(); },
  add(item) {
    const c = this.get();
    const key = [item.id, item.variant || '', item.pack].join('|');
    const ex = c.find(i => i.key === key);
    if (ex) ex.qty += item.qty; else c.push({ ...item, key });
    this.set(c);
  },
  change(key, d) {
    let c = this.get();
    const it = c.find(i => i.key === key);
    if (it) it.qty += d;
    c = c.filter(i => i.qty > 0);
    this.set(c);
  },
  remove(key) { this.set(this.get().filter(i => i.key !== key)); },
  clear() { this.set([]); },
  lines(src) {
    return (src || this.get()).map(i => {
      const p = byId(i.id); if (!p) return null;
      const unit = packPrice(p, i.pack);
      return { ...i, p, unit, total: unit * i.qty };
    }).filter(Boolean);
  },
  total(src) { return this.lines(src).reduce((s, l) => s + l.total, 0); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); }
};

/* ---------- layout ---------- */
const NAV = [['index.html', 'Home', 'home'], ['products.html', 'All Products', 'products'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];
const SOC = {
  instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" style="fill:#fff;stroke:none"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
};
const socialHTML = () => Object.keys(SOC).map(k => `<a class="${k}" href="${BRAND.social[k]}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}">${SOC[k]}</a>`).join('');
const ic = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
  shop: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11H6.2L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};
function layout() {
  const page = document.body.dataset.page;
  $('#site-header').innerHTML = `
  <div class="announce">Free Delivery on Every Order!</div>
  <header class="hdr"><div class="wrap">
    <a href="index.html" class="logo" aria-label="${BRAND.name} home"><img src="img/logo.png" alt="${BRAND.name}"></a>
    <nav class="nav" id="nav">${NAV.map(n => `<a href="${n[0]}" class="${page === n[2] ? 'on' : ''}">${n[1]}</a>`).join('')}</nav>
    <div class="icons">
      <button class="ib dsk" id="sbtn" aria-label="Search">${ic.search}</button>
      <button class="ib dsk" id="cbtn" aria-label="Open cart">${ic.cart}<span class="cnt" id="ccount">0</span></button>
      <button class="ib burger" id="bbtn" aria-label="Menu">${ic.menu}</button>
    </div>
  </div></header>
  <div class="searchbar" id="sbar"><div class="wrap sw"><input id="sinput" type="search" placeholder="Search products and press Enter" aria-label="Search products"><button class="ib" id="sclose" aria-label="Close search" style="font-size:24px">×</button></div></div>`;
  $('#site-footer').innerHTML = `
  <footer class="ftr"><div class="wrap">
    <div class="top">
      <div><a href="index.html" class="logo"><img src="img/logo.png" alt="${BRAND.name}"></a>
        <p style="margin-top:14px;max-width:280px">Sneaker care, protection and storage for people who care about every step.</p></div>
      <div><h4>Contact Us</h4>
        <p>📞 <a href="tel:+91${BRAND.phone}">${BRAND.phone}</a></p>
        <p>✉️ <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
        <p>📍 ${BRAND.address}</p></div>
      <div><h4>Join Our Email List</h4>
        <form class="news" id="news"><input type="email" required placeholder="Your email id" aria-label="Email"><button aria-label="Subscribe">→</button></form>
        <div class="soc">${socialHTML()}</div></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</div>
  </div></footer>
  <nav class="bnav" aria-label="Quick navigation">
    <a href="index.html" class="${page === 'home' ? 'on' : ''}">${ic.home}<span>Home</span></a>
    <a href="products.html" class="${page === 'products' || page === 'product' ? 'on' : ''}">${ic.shop}<span>Shop</span></a>
    <button id="sbtn2" aria-label="Search">${ic.search}<span>Search</span></button>
    <button id="cbtn2" aria-label="Open cart">${ic.cart}<span>Cart</span><b class="cnt" id="ccount2">0</b></button>
  </nav>
  <div class="ov" id="ov"></div>
  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="dh">Your Cart <button id="dclose" aria-label="Close">×</button></div>
    <div class="db" id="dbody"></div>
    <div class="df" id="dfoot"></div>
  </aside>
  <div class="toast" id="toast"></div>`;
  $('#bbtn').onclick = () => $('#nav').classList.toggle('open');
  const openS = () => { $('#sbar').classList.add('open'); $('#sinput').focus(); };
  const closeS = () => $('#sbar').classList.remove('open');
  $('#sbtn').onclick = () => $('#sbar').classList.contains('open') ? closeS() : openS();
  $('#sbtn2').onclick = openS; $('#sclose').onclick = closeS;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeS(); toggleDrawer(false); } });
  $('#sinput').onkeydown = e => { if (e.key === 'Enter' && e.target.value.trim()) location.href = 'products.html?q=' + encodeURIComponent(e.target.value.trim()); };
  $('#cbtn').onclick = $('#cbtn2').onclick = () => toggleDrawer(true);
  $('#dclose').onclick = $('#ov').onclick = () => toggleDrawer(false);
  $('#news').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('Thanks for subscribing!'); };
  renderCart();
}
function toggleDrawer(o) { $('#drawer').classList.toggle('open', o); $('#ov').classList.toggle('open', o); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); }
function renderCart() {
  const cc = $('#ccount'); if (!cc) return;
  const n = Cart.count(); if (cc.textContent != n) { cc.classList.remove('pop'); void cc.offsetWidth; cc.classList.add('pop'); } cc.textContent = n; cc.style.display = n ? '' : 'none';
  const c2 = $('#ccount2'); if (c2) { c2.textContent = n; c2.style.display = n ? '' : 'none'; }
  const lines = Cart.lines();
  $('#dbody').innerHTML = lines.length ? lines.map(l => `
    <div class="ci"><img src="${imgFor(l.p, 0)}" alt="">
      <div><a href="product.html?id=${l.id}"><b>${l.p.name}</b></a><br>
        <span style="color:var(--mute)">${l.variant ? l.variant + ' · ' : ''}Pack of ${l.pack}</span>
        <div class="qty" style="margin-top:8px"><button data-k="${l.key}" data-d="-1">−</button><span>${l.qty}</span><button data-k="${l.key}" data-d="1">+</button></div>
        <button class="rm" data-r="${l.key}">Remove</button></div>
      <b>${INR(l.total)}</b></div>`).join('')
    : '<div class="empty">Your cart is empty.<br><br><a class="btn dark" href="products.html">Shop products</a></div>';
  $('#dfoot').innerHTML = lines.length ? `<div class="tot"><span>Subtotal</span><span>${INR(Cart.total())}</span></div>
    <a class="btn block" href="checkout.html">Checkout</a>` : '';
  $$('[data-d]', $('#dbody')).forEach(b => b.onclick = () => Cart.change(b.dataset.k, +b.dataset.d));
  $$('[data-r]', $('#dbody')).forEach(b => b.onclick = () => Cart.remove(b.dataset.r));
}

/* ---------- cards ---------- */
function cardHTML(p) {
  return `<article class="card">
    <a href="product.html?id=${p.id}" class="im" aria-label="${p.name}"><img loading="lazy" src="${imgFor(p, 0)}" alt="${p.name}">${p.soldout ? '<span class="tag">Sold out</span>' : ''}</a>
    <div class="rt"><b>${p.rating.toFixed(2)}</b> <i>★</i> ${p.reviews}+ Reviews</div>
    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
    <div class="pr">${INR(p.price)}<s>${INR(p.mrp)}</s></div>
    <span class="off">${off(p)}% OFF</span>
    ${p.soldout ? '<button class="btn block" disabled>SOLD OUT</button>' : `<a class="btn dark block" href="product.html?id=${p.id}">CHOOSE OPTIONS</a>`}
  </article>`;
}

/* ---------- pages ---------- */
function initHome() {
  // hero slider
  const sl = $('#slides'), dots = $('#dots'); let cur = 0; const n = sl.children.length;
  dots.innerHTML = [...Array(n)].map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join('');
  const go = i => { cur = (i + n) % n; sl.style.transform = `translateX(-${cur * 100}%)`; $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === cur)); };
  $$('button', dots).forEach((b, i) => b.onclick = () => go(i)); go(0); setInterval(() => go(cur + 1), 5500);
  // concern tabs
  const cmap = { care: 'Care', protect: 'Protect', storage: 'Storage' };
  const ct = $('#concernTabs'), cg = $('#concernGrid');
  ct.innerHTML = Object.keys(cmap).map(k => `<button class="tab" data-k="${k}">${cmap[k]}</button>`).join('');
  const showC = k => {
    $$('.tab', ct).forEach(b => b.classList.toggle('on', b.dataset.k === k));
    cg.innerHTML = PRODUCTS.filter(p => p.concern === k).slice(0, 4).map(p => `<a class="cc" href="product.html?id=${p.id}"><div class="im"><img src="${imgFor(p, 0)}" alt=""></div>${p.name.replace('Kicksglow ', '')}</a>`).join('');
  };
  $$('.tab', ct).forEach(b => b.onclick = () => showC(b.dataset.k)); showC('care');
  // best sellers
  const bmap = { kits: 'Kits', wipes: 'Wipes', insoles: 'Insoles', crates: 'Crates' };
  const bt = $('#bestTabs'), bg = $('#bestGrid');
  bt.innerHTML = Object.keys(bmap).map(k => `<button class="tab" data-k="${k}">${bmap[k]}</button>`).join('');
  const showB = k => {
    $$('.tab', bt).forEach(b => b.classList.toggle('on', b.dataset.k === k));
    bg.innerHTML = PRODUCTS.filter(p => p.cat === k).map(cardHTML).join('');
  };
  $$('.tab', bt).forEach(b => b.onclick = () => showB(b.dataset.k)); showB('kits');
}

function initProducts() {
  const q = new URLSearchParams(location.search), cat = q.get('cat') || 'all', s = (q.get('q') || '').toLowerCase();
  $('#cats').innerHTML = CATS.map(c => `<a href="products.html${c.id === 'all' ? '' : '?cat=' + c.id}" class="${c.id === cat && !s ? 'on' : ''}"><span class="e">${c.e}</span>${c.name}</a>`).join('');
  let list = PRODUCTS.filter(p => (cat === 'all' || p.cat === cat) && (!s || p.name.toLowerCase().includes(s)));
  $('#ptitle').textContent = s ? `Results for "${q.get('q')}"` : (CATS.find(c => c.id === cat) || CATS[0]).name;
  $('#pgrid').innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="empty" style="grid-column:1/-1">No products found. Try another search.</div>';
}

function fmtDate(d) { return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); }
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d; }

function initProduct() {
  const id = new URLSearchParams(location.search).get('id'), p = byId(id);
  if (!p) { $('#pd').innerHTML = '<div class="empty">Product not found. <a class="btn dark" href="products.html">Back to all products</a></div>'; return; }
  document.title = p.name + ' – Kicksglow';
  let state = { variant: p.variants ? p.variants[p.variants.length - 1] : '', pack: 1, qty: 1, img: 0 };
  const render = () => {
    $('#pd').innerHTML = `
    <div class="gal"><div class="main"><img id="mainimg" src="${imgFor(p, state.img)}" alt="${p.name}"></div>
      <div class="thumbs">${[0, 1, 2, 3].map(i => `<button class="${i === state.img ? 'on' : ''}" data-i="${i}" aria-label="Image ${i + 1}"><img src="${imgFor(p, i)}" alt=""></button>`).join('')}</div></div>
    <div class="info">
      <span class="rate">${p.rating.toFixed(1)} ★ &nbsp;${p.reviews}+ Reviews &amp; Ratings</span>
      <h1>${p.name}</h1>
      <div class="pp">${INR(packPrice(p, state.pack))}<s>${INR(packMrp(p, state.pack))}</s><em>${Math.round((1 - packPrice(p, state.pack) / packMrp(p, state.pack)) * 100)}% OFF</em> <small style="font-size:12px;font-weight:400;color:var(--mute)">Tax included</small></div>
      <p style="margin-top:10px;color:var(--ink2);font-size:14px">${p.desc}</p>
      ${p.variants ? `<div class="lbl">Select Size: <b>${state.variant}</b></div><div class="opts">${p.variants.map(v => `<button class="opt ${v === state.variant ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}</div>` : ''}
      <div class="lbl">Pack: <b>Pack of ${state.pack}</b></div>
      <div class="packs">${PACKS.map(k => `<button class="pack ${k.n === state.pack ? 'on' : ''}" data-p="${k.n}"><span>${k.label}${k.badge ? `<span class="bd">${k.badge}</span>` : ''}</span><span><s>${INR(packMrp(p, k.n))}</s><b>${INR(packPrice(p, k.n))}</b></span></button>`).join('')}</div>
      <div class="lbl">Quantity</div>
      <div class="qty"><button id="qm" aria-label="Decrease">−</button><span>${state.qty}</span><button id="qp" aria-label="Increase">+</button></div>
      <div class="buy">
        ${p.soldout ? '<button class="btn block" disabled>SOLD OUT</button>' :
          '<button class="btn dark block" id="addc">ADD TO CART</button><button class="btn block" id="buyn">BUY IT NOW</button>'}
      </div>
      <div class="trk"><div><b>🛍️</b>${fmtDate(addDays(0))}<br>Purchased</div><div><b>🚚</b>${fmtDate(addDays(1))} - ${fmtDate(addDays(2))}<br>Est. Shipping</div><div><b>📍</b>${fmtDate(addDays(4))} - ${fmtDate(addDays(5))}<br>Est. Delivery</div></div>
      <div class="svc"><div><b>📦</b>Free Delivery</div><div><b>💵</b>COD Available</div><div><b>⏱️</b>24 Hours Dispatch</div></div>
      <div class="acc">
        <details><summary>Description</summary><p>${p.desc} Made for everyday sneakerheads who want their pairs to look and feel fresh.</p></details>
        <details><summary>What's Inside</summary><ul>${p.inside.map(i => `<li>${i}</li>`).join('')}</ul></details>
        <details><summary>Product Information</summary><p>Brand: Kicksglow. Store the product in a cool, dry place. For support call ${BRAND.phone} or write to ${BRAND.email}.</p></details>
      </div>
    </div>`;
    $$('.thumbs button').forEach(b => b.onclick = () => { state.img = +b.dataset.i; render(); });
    $$('[data-v]').forEach(b => b.onclick = () => { state.variant = b.dataset.v; render(); });
    $$('[data-p]').forEach(b => b.onclick = () => { state.pack = +b.dataset.p; render(); });
    $('#qm').onclick = () => { state.qty = Math.max(1, state.qty - 1); render(); };
    $('#qp').onclick = () => { state.qty = Math.min(20, state.qty + 1); render(); };
    const item = () => ({ id: p.id, variant: state.variant, pack: state.pack, qty: state.qty });
    if ($('#addc')) {
      $('#addc').onclick = () => { Cart.add(item()); toast('Added to cart'); toggleDrawer(true); };
      $('#buyn').onclick = () => {
        try { sessionStorage.setItem('kg_buynow', JSON.stringify([{ ...item(), key: 'bn' }])); } catch (e) {}
        location.href = 'checkout.html?mode=buynow';
      };
    }
  };
  render();
  // related
  $('#related').innerHTML = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0, 4).map(cardHTML).join('');
}

function initCheckout() {
  const buyNow = new URLSearchParams(location.search).get('mode') === 'buynow';
  let src = null;
  if (buyNow) { try { src = JSON.parse(sessionStorage.getItem('kg_buynow')); } catch (e) {} }
  const lines = Cart.lines(src), total = Cart.total(src);
  if (!lines.length) { $('#co').innerHTML = '<div class="empty" style="grid-column:1/-1">Nothing to checkout yet.<br><br><a class="btn dark" href="products.html">Shop products</a></div>'; return; }
  $('#sum').innerHTML = lines.map(l => `<div class="ci" style="grid-template-columns:60px 1fr auto"><img src="${imgFor(l.p, 0)}" alt="" style="width:60px;height:60px"><div>${l.p.name}<br><span style="color:var(--mute)">${l.variant ? l.variant + ' · ' : ''}Pack of ${l.pack} × ${l.qty}</span></div><b>${INR(l.total)}</b></div>`).join('') +
    `<div class="row" style="margin-top:14px"><span>Subtotal</span><span>${INR(total)}</span></div><div class="row"><span>Shipping</span><span>Free</span></div><div class="row t"><span>Total</span><span>${INR(total)}</span></div>`;
  $('#coform').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), data = Object.fromEntries(f.entries());
    if (!/^[6-9]\d{9}$/.test(data.phone)) { toast('Enter a valid 10 digit mobile number'); return; }
    if (!/^\d{6}$/.test(data.pin)) { toast('Enter a valid 6 digit pincode'); return; }
    const order = { id: 'KG' + Date.now().toString().slice(-8), date: new Date().toISOString(), customer: data, items: lines.map(l => ({ name: l.p.name, variant: l.variant, pack: l.pack, qty: l.qty, total: l.total })), total, payment: data.pay };
    try {
      const o = JSON.parse(localStorage.getItem('kg_orders') || '[]'); o.push(order);
      localStorage.setItem('kg_orders', JSON.stringify(o)); localStorage.setItem('kg_last', JSON.stringify(order));
      sessionStorage.removeItem('kg_buynow');
    } catch (err) {}
    if (!buyNow) Cart.clear();
    location.href = 'success.html';
  };
}

function initSuccess() {
  let o = null; try { o = JSON.parse(localStorage.getItem('kg_last')); } catch (e) {}
  if (o) $('#oinfo').innerHTML = `Order <b>${o.id}</b> · ${INR(o.total)} · ${o.payment === 'cod' ? 'Cash on Delivery' : 'Online payment'}<br>Hum aapko ${o.customer.phone} par update bhejenge.`;
}

function initContact() {
  $('#cform').onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target).entries());
    if (!/^[6-9]\d{9}$/.test(d.phone)) { toast('Enter a valid 10 digit mobile number'); return; }
    if (!d.name || !d.msg || !/.+@.+\..+/.test(d.email)) { toast('Please fill all fields correctly'); return; }
    const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\n\n${d.msg}`;
    $('#okmsg').classList.add('show');
    location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(d.subject + ' - ' + d.name)}&body=${encodeURIComponent(body)}`;
  };
}

function initAbout() {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  $$('[data-count]').forEach(el => io.observe(el));
}

function initReveal() {
  const els = $$('.reveal'); if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

// photo missing ho to placeholder (.svg) dikhao
document.addEventListener('error', e => {
  const im = e.target; if (!im || im.tagName !== 'IMG') return;
  const src = im.getAttribute('src') || '';
  if (src.includes('img/products/') && !src.endsWith('.svg')) im.src = src.replace(/\.\w+$/, '.svg');
}, true);

document.addEventListener('DOMContentLoaded', () => {
  layout();
  $$('.soc-auto').forEach(el => el.innerHTML = socialHTML());
  const fn = { home: initHome, products: initProducts, product: initProduct, checkout: initCheckout, success: initSuccess, contact: initContact, about: initAbout }[document.body.dataset.page];
  if (fn) fn();
  initReveal();
});
