/* Kicksglow – storefront logic (no backend: cart/orders live in the browser) */
(function () {
  "use strict";

  /* ---- settings you can edit ---- */
  var SHOP = {
    name: "Kicksglow",
    phone: "8929635309",
    wa: "918929635309",
    email: "shoyabswag786@gmail.com",
    coupons: { FIRST5: 0.05 },   // code -> discount fraction
    upiNumber: "8929635309",
    upiId: "",                   // add your UPI ID (e.g. name@bank) to enable the "Pay now" app button
    shippingFee: 0,              // flat shipping (prepaid)
    codFee: 0                    // extra fee for Cash on Delivery
  };

  var P = window.PRODUCTS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---- storage helpers ---- */
  function read(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---- cart ---- */
  function getCart() { return read("kg_cart", []).filter(function (i) { return byId(i.id); }); }
  function saveCart(c) { write("kg_cart", c); updateCount(); }
  function cartCount() { return getCart().reduce(function (a, i) { return a + i.qty; }, 0); }
  function updateCount() {
    var n = cartCount();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n || ""; el.setAttribute("data-n", n); });
  }
  function addToCart(id, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var c = getCart(), f = c.filter(function (i) { return i.id === id; })[0];
    if (f) f.qty += qty; else c.push({ id: id, qty: qty });
    saveCart(c);
  }
  function setQty(id, qty) {
    var c = getCart();
    c.forEach(function (i) { if (i.id === id) i.qty = Math.max(1, Math.min(99, qty)); });
    saveCart(c);
  }
  function removeItem(id) { saveCart(getCart().filter(function (i) { return i.id !== id; })); }
  function totals(payMethod) {
    var c = getCart();
    var sub = c.reduce(function (a, i) { return a + byId(i.id).price * i.qty; }, 0);
    var code = read("kg_coupon", "");
    var rate = SHOP.coupons[code] || 0;
    var disc = Math.round(sub * rate * 100) / 100;
    var ship = c.length ? SHOP.shippingFee + (payMethod === "cod" ? SHOP.codFee : 0) : 0;
    return { items: c, sub: sub, code: rate ? code : "", disc: disc, ship: ship, total: sub - disc + ship };
  }

  /* ---- toast ---- */
  var toastEl;
  function toast(html) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.innerHTML = html; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  /* ---- header: menu, dropdown, search ---- */
  function initHeader() {
    var toggle = $(".menu-toggle"), nav = $(".main-nav");
    if (toggle) toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    $$(".nav-drop > button").forEach(function (b) {
      b.addEventListener("click", function () { b.parentNode.classList.toggle("open"); });
    });
    var ov = $(".search-overlay"), inp = ov && $("input", ov), res = ov && $(".search-results", ov);
    function render(q) {
      q = (q || "").toLowerCase().trim();
      var list = P.filter(function (p) { return !q || (p.name + " " + p.cat + " " + p.short).toLowerCase().indexOf(q) > -1; });
      res.innerHTML = list.length ? list.map(function (p) {
        return '<a class="search-item" href="' + p.url + '"><img src="' + p.images[0] + '" alt=""><span><b>' + esc(p.name) + '</b><span class="muted">' + money(p.price) + '</span></span></a>';
      }).join("") : '<p class="muted" style="padding:10px">No products found.</p>';
    }
    $$("[data-open-search]").forEach(function (b) {
      b.addEventListener("click", function () { ov.classList.add("open"); inp.value = ""; render(""); setTimeout(function () { inp.focus(); }, 30); });
    });
    if (ov) {
      ov.addEventListener("click", function (e) { if (e.target === ov) ov.classList.remove("open"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") ov.classList.remove("open"); });
      inp.addEventListener("input", function () { render(inp.value); });
    }
  }

  /* ---- add / buy buttons (any page) ---- */
  function initButtons() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-add]");
      if (a) {
        e.preventDefault();
        var qtyEl = $("#qty"), q = a.hasAttribute("data-use-qty") && qtyEl ? qtyEl.value : 1;
        addToCart(a.getAttribute("data-add"), q);
        if (a.hasAttribute("data-buy")) { location.href = "checkout.html"; return; }
        toast("Added to cart <a href='cart.html'>View cart</a>");
      }
    });
  }

  /* ---- product listing filter ---- */
  function initListing() {
    var chips = $$(".chip[data-cat]");
    if (!chips.length) return;
    var cards = $$("[data-card]");
    function apply(cat) {
      chips.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-cat") === cat); });
      cards.forEach(function (c) { c.style.display = (cat === "all" || c.getAttribute("data-card") === cat) ? "" : "none"; });
      var t = $("#list-title");
      var active = chips.filter(function (c) { return c.getAttribute("data-cat") === cat; })[0];
      if (t && active) t.textContent = cat === "all" ? "All Products" : active.textContent;
    }
    var cat = new URLSearchParams(location.search).get("cat") || "all";
    if (!chips.some(function (c) { return c.getAttribute("data-cat") === cat; })) cat = "all";
    apply(cat);
    chips.forEach(function (c) {
      c.addEventListener("click", function (e) {
        e.preventDefault();
        var k = c.getAttribute("data-cat"); apply(k);
        history.replaceState(null, "", k === "all" ? "products.html" : "products.html?cat=" + k);
      });
    });
  }

  /* ---- product page ---- */
  function initProduct() {
    var main = $("#gallery-main");
    if (!main) return;
    $$(".thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        main.src = b.getAttribute("data-src");
        $$(".thumbs button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
      });
    });
    var q = $("#qty");
    $("#qty-minus").addEventListener("click", function () { q.value = Math.max(1, (parseInt(q.value, 10) || 1) - 1); });
    $("#qty-plus").addEventListener("click", function () { q.value = Math.min(99, (parseInt(q.value, 10) || 1) + 1); });
  }

  /* ---- coupon box (cart + checkout) ---- */
  function bindCoupon(rerender) {
    var form = $("#coupon-form"); if (!form) return;
    var inp = $("input", form), msg = $("#coupon-msg");
    var cur = read("kg_coupon", "");
    if (cur && SHOP.coupons[cur]) { inp.value = cur; msg.textContent = "Code " + cur + " applied"; msg.className = "msg ok"; }
    function apply() {
      var code = inp.value.trim().toUpperCase();
      if (!code) { write("kg_coupon", ""); msg.textContent = ""; rerender(); return; }
      if (SHOP.coupons[code]) { write("kg_coupon", code); msg.textContent = "Code " + code + " applied"; msg.className = "msg ok"; }
      else { write("kg_coupon", ""); msg.textContent = "Invalid discount code"; msg.className = "msg err"; }
      rerender();
    }
    if (form.tagName === "FORM") form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });
    else {
      $("#coupon-apply", form).addEventListener("click", apply);
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); apply(); } });
    }
  }
  function sumRows(t) {
    return '<div class="sum-row"><span>Subtotal</span><b>' + money(t.sub) + '</b></div>' +
      (t.disc ? '<div class="sum-row"><span>Discount (' + t.code + ')</span><b>-' + money(t.disc) + '</b></div>' : '') +
      '<div class="sum-row"><span>Shipping</span><b>' + (t.ship ? money(t.ship) : "Free") + '</b></div>' +
      '<div class="sum-row total"><span>Total</span><span>' + money(t.total) + '</span></div>';
  }

  /* ---- cart page ---- */
  function initCart() {
    var box = $("#cart-items"); if (!box) return;
    function render() {
      var t = totals();
      if (!t.items.length) {
        $("#cart-layout").style.display = "none"; $("#cart-empty").style.display = "block"; return;
      }
      $("#cart-layout").style.display = ""; $("#cart-empty").style.display = "none";
      box.innerHTML = t.items.map(function (i) {
        var p = byId(i.id);
        return '<div class="cart-item"><a href="' + p.url + '"><img src="' + p.images[0] + '" alt="' + esc(p.name) + '"></a>' +
          '<div><h3><a href="' + p.url + '">' + esc(p.name) + '</a></h3><div class="muted">' + money(p.price) + '</div>' +
          '<div class="qty" style="margin-top:8px"><button data-dec="' + p.id + '" aria-label="Decrease">−</button><input value="' + i.qty + '" readonly><button data-inc="' + p.id + '" aria-label="Increase">+</button></div><br>' +
          '<button class="link-btn" data-rm="' + p.id + '">Remove</button></div>' +
          '<div class="line-total"><b>' + money(p.price * i.qty) + '</b></div></div>';
      }).join("");
      $("#cart-sum").innerHTML = sumRows(t);
    }
    box.addEventListener("click", function (e) {
      var t = e.target, id;
      if ((id = t.getAttribute("data-inc"))) { setQty(id, getCart().filter(function (i) { return i.id === id; })[0].qty + 1); render(); }
      else if ((id = t.getAttribute("data-dec"))) { setQty(id, getCart().filter(function (i) { return i.id === id; })[0].qty - 1); render(); }
      else if ((id = t.getAttribute("data-rm"))) { removeItem(id); render(); }
    });
    bindCoupon(render); render();
  }

  /* ---- checkout page ---- */
  function initCheckout() {
    var form = $("#checkout-form"); if (!form) return;
    function pay() { var r = $("input[name=pay]:checked", form); return r ? r.value : "cod"; }
    function render() {
      var t = totals(pay());
      if (!t.items.length) { $("#co-wrap").style.display = "none"; $("#co-empty").style.display = "block"; return t; }
      $("#co-lines").innerHTML = t.items.map(function (i) {
        var p = byId(i.id);
        return '<div class="sum-line"><div class="th"><img src="' + p.images[0] + '" alt=""><span class="q">' + i.qty + '</span></div><div class="nm">' + esc(p.name) + '</div><b>' + money(p.price * i.qty) + '</b></div>';
      }).join("");
      $("#co-sum").innerHTML = sumRows(t);
      return t;
    }
    var acc = read("kg_account", null);
    if (acc) { ["name", "email", "phone"].forEach(function (k) { if (acc[k] && form.elements[k]) form.elements[k].value = acc[k]; }); }
    $$("input[name=pay]", form).forEach(function (r) { r.addEventListener("change", render); });
    bindCoupon(render); render();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = totals(pay());
      if (!t.items.length) return;
      var f = form.elements;
      if (!/^[6-9]\d{9}$/.test(f.phone.value.replace(/\D/g, "").slice(-10))) { alert("Please enter a valid 10-digit mobile number."); f.phone.focus(); return; }
      if (!/^\d{6}$/.test(f.pin.value.trim())) { alert("Please enter a valid 6-digit PIN code."); f.pin.focus(); return; }
      var id = "KG" + Date.now().toString().slice(-8);
      var order = {
        id: id, date: new Date().toISOString(), status: "Order placed",
        pay: pay(), name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.replace(/\D/g, "").slice(-10),
        address: f.address.value.trim() + ", " + f.city.value.trim() + ", " + f.state.value.trim() + " - " + f.pin.value.trim(),
        items: t.items.map(function (i) { var p = byId(i.id); return { name: p.name, qty: i.qty, price: p.price }; }),
        sub: t.sub, disc: t.disc, code: t.code, ship: t.ship, total: t.total
      };
      var orders = read("kg_orders", []); orders.unshift(order); write("kg_orders", orders);
      write("kg_cart", []); write("kg_coupon", "");
      location.href = "order-success.html?id=" + id;
    });
  }

  function orderText(o) {
    var lines = ["*New order " + o.id + " – " + SHOP.name + "*", ""];
    o.items.forEach(function (i) { lines.push(i.qty + " x " + i.name + " – ₹" + (i.qty * i.price).toFixed(2)); });
    lines.push("", "Total: ₹" + o.total.toFixed(2) + " (" + (o.pay === "cod" ? "Cash on Delivery" : "UPI to " + SHOP.upiNumber) + ")",
      "", "Name: " + o.name, "Phone: " + o.phone, "Email: " + o.email, "Address: " + o.address);
    return lines.join("\n");
  }

  /* ---- order success ---- */
  function initSuccess() {
    var box = $("#order-box"); if (!box) return;
    var id = new URLSearchParams(location.search).get("id");
    var o = read("kg_orders", []).filter(function (x) { return x.id === id; })[0];
    if (!o) { box.innerHTML = '<p>We could not find that order in this browser. Please <a href="contact.html" style="text-decoration:underline">contact us</a>.</p>'; return; }
    $("#order-id").textContent = o.id;
    box.innerHTML = '<div class="order-card"><b>Order summary</b><br><br>' +
      o.items.map(function (i) { return '<div class="sum-row"><span>' + i.qty + ' × ' + esc(i.name) + '</span><b>' + money(i.qty * i.price) + '</b></div>'; }).join("") +
      '<div class="sum-row total"><span>Total</span><span>' + money(o.total) + '</span></div>' +
      '<p class="muted" style="margin:14px 0 0"><b>Payment:</b> ' + (o.pay === "cod" ? "Cash on Delivery" : "UPI – pay ₹' + o.total.toFixed(2) + ' to UPI number ' + SHOP.upiNumber + ' and send the screenshot on WhatsApp") + '<br><b>Deliver to:</b> ' + esc(o.name) + ', ' + esc(o.address) + '<br><b>Phone:</b> ' + esc(o.phone) + '</p></div>';
    var up = $("#upi-box");
    if (up && o.pay !== "cod") {
      up.style.display = "block";
      $("#upi-amt").textContent = money(o.total); $("#upi-num").textContent = SHOP.upiNumber;
      var pb = $("#upi-pay");
      if (SHOP.upiId) pb.href = "upi://pay?pa=" + encodeURIComponent(SHOP.upiId) + "&pn=Kicksglow&am=" + o.total.toFixed(2) + "&cu=INR&tn=" + o.id; else pb.style.display = "none";
    }
    $("#wa-btn").href = "https://wa.me/" + SHOP.wa + "?text=" + encodeURIComponent(orderText(o));
    $("#mail-btn").href = "mailto:" + SHOP.email + "?subject=" + encodeURIComponent("New order " + o.id) + "&body=" + encodeURIComponent(orderText(o).replace(/\*/g, ""));
  }

  /* ---- track order ---- */
  function initTrack() {
    var form = $("#track-form"); if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var id = form.elements.oid.value.trim().toUpperCase(), ph = form.elements.phone.value.replace(/\D/g, "").slice(-10);
      var o = read("kg_orders", []).filter(function (x) { return x.id === id && x.phone === ph; })[0];
      var out = $("#track-out");
      if (!o) { out.innerHTML = '<div class="order-card"><b>Order not found.</b><p class="muted" style="margin:6px 0 0">Check your Order ID and phone number, or message us on <a style="text-decoration:underline" href="https://wa.me/' + SHOP.wa + '">WhatsApp</a>.</p></div>'; return; }
      var steps = ["Order placed", "Packed", "Shipped", "Delivered"], idx = Math.max(0, steps.indexOf(o.status));
      out.innerHTML = '<div class="order-card"><b>Order ' + o.id + '</b> · ' + new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + '<br><br>' +
        steps.map(function (s, i) { return '<div style="margin-bottom:8px">' + (i <= idx ? "✅" : "⬜") + ' ' + s + '</div>'; }).join("") +
        '<p class="muted" style="margin:12px 0 0">' + o.items.map(function (i) { return i.qty + ' × ' + esc(i.name); }).join(", ") + ' · ' + money(o.total) + '</p></div>';
    });
  }

  /* ---- account (local profile + orders) ---- */
  function initAccount() {
    var form = $("#account-form"); if (!form) return;
    var acc = read("kg_account", null), view = $("#account-view");
    function show() {
      acc = read("kg_account", null);
      form.style.display = acc ? "none" : ""; view.style.display = acc ? "" : "none";
      if (!acc) return;
      $("#acc-name").textContent = acc.name;
      var os = read("kg_orders", []);
      $("#acc-orders").innerHTML = os.length ? os.map(function (o) {
        return '<div class="order-card" style="margin:0 0 12px"><b>' + o.id + '</b> · ' + new Date(o.date).toLocaleDateString("en-IN") + ' · ' + money(o.total) + '<br><span class="muted">' + o.items.map(function (i) { return i.qty + ' × ' + esc(i.name); }).join(", ") + '</span></div>';
      }).join("") : '<p class="muted">No orders yet. <a href="products.html" style="text-decoration:underline">Start shopping</a></p>';
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      write("kg_account", { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), phone: form.elements.phone.value.replace(/\D/g, "").slice(-10) });
      show();
    });
    $("#acc-out").addEventListener("click", function () { try { localStorage.removeItem("kg_account"); } catch (e) {} show(); });
    show();
  }

  /* ---- contact / b2b → WhatsApp or e-mail ---- */
  function initMessageForms() {
    $$("form[data-msg]").forEach(function (form) {
      var kind = form.getAttribute("data-msg");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var f = form.elements, parts = [];
        $$("[name]", form).forEach(function (el) { if (el.value && el.type !== "submit") parts.push((el.getAttribute("data-label") || el.name) + ": " + el.value); });
        var text = "[" + SHOP.name + " " + kind + " enquiry]\n" + parts.join("\n");
        var via = e.submitter && e.submitter.getAttribute("data-via");
        if (via === "mail") location.href = "mailto:" + SHOP.email + "?subject=" + encodeURIComponent(SHOP.name + " " + kind + " enquiry") + "&body=" + encodeURIComponent(text);
        else window.open("https://wa.me/" + SHOP.wa + "?text=" + encodeURIComponent(text), "_blank");
        var ok = $(".form-ok", form); if (ok) ok.style.display = "block";
      });
    });
    $$("form[data-news]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var l = read("kg_news", []); l.push(form.elements.email.value); write("kg_news", l);
        form.reset(); toast("Thanks for subscribing!");
      });
    });
  }

  function initSlider() {
    var c = $("#cmp"); if (!c) return;
    var r = $(".cmp-range", c), b = $(".cmp-before", c), bar = $(".cmp-bar", c);
    function set() { var v = r.value; b.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; bar.style.left = v + "%"; }
    r.addEventListener("input", set); set();
  }
  function initCarousels() {
    $$(".car").forEach(function (c) {
      var t = $(".car-track", c), n = t.children.length, i = 0;
      function go(k) { i = (k + n) % n; t.style.transform = "translateX(-" + i * 100 + "%)"; }
      $(".prev", c).addEventListener("click", function () { go(i - 1); });
      $(".next", c).addEventListener("click", function () { go(i + 1); });
    });
  }
  function initReviews() {
    var list = $("#rev-list"); if (!list) return;
    var rating = 0;
    function all() { return read("kg_reviews", []); }
    function starsHtml(n) { var s = ""; for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= Math.round(n) ? "on" : "") + '">★</span>'; return s; }
    function render() {
      var rs = all(), f = parseInt($("#rev-filter").value, 10), so = $("#rev-sort").value;
      var avg = rs.length ? rs.reduce(function (a, r) { return a + r.rating; }, 0) / rs.length : 0;
      $("#rev-avg").textContent = avg.toFixed(1); $("#rev-stars").innerHTML = starsHtml(avg);
      $("#rev-count").textContent = rs.length + (rs.length === 1 ? " review" : " reviews");
      var v = rs.filter(function (r) { return !f || r.rating === f; });
      v.sort(function (a, b) { return so === "high" ? b.rating - a.rating : so === "low" ? a.rating - b.rating : b.date - a.date; });
      $("#rev-empty").style.display = rs.length ? "none" : "block";
      list.innerHTML = v.map(function (r) {
        return '<article class="rev-card"><div class="stars">' + starsHtml(r.rating) + '</div><h4>' + esc(r.name) + '</h4><p>' + esc(r.text) + '</p>' + (r.photo ? '<img src="' + r.photo + '" alt="Review photo">' : "") + '</article>';
      }).join("");
      $("#rev-photos").innerHTML = rs.filter(function (r) { return r.photo; }).map(function (r) { return '<img src="' + r.photo + '" alt="">'; }).join("");
      list.scrollLeft = 0;
    }
    $("#rev-filter").addEventListener("change", render); $("#rev-sort").addEventListener("change", render);
    $("#rev-prev").addEventListener("click", function () { list.scrollBy({ left: -list.clientWidth * .8, behavior: "smooth" }); });
    $("#rev-next").addEventListener("click", function () { list.scrollBy({ left: list.clientWidth * .8, behavior: "smooth" }); });
    var modal = $("#rev-modal"), form = $("#rev-form");
    function paint() { $$("#rev-pick button").forEach(function (b) { b.classList.toggle("on", parseInt(b.getAttribute("data-v"), 10) <= rating); }); }
    $("#rev-open").addEventListener("click", function () { modal.classList.add("open"); rating = 0; paint(); form.reset(); });
    $("#rev-close").addEventListener("click", function () { modal.classList.remove("open"); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("open"); });
    $$("#rev-pick button").forEach(function (b) { b.addEventListener("click", function () { rating = parseInt(b.getAttribute("data-v"), 10); paint(); }); });
    function save(photo) {
      var rs = all(); rs.push({ name: form.elements.name.value.trim(), text: form.elements.text.value.trim(), rating: rating, photo: photo || "", date: Date.now() });
      write("kg_reviews", rs); modal.classList.remove("open"); render(); toast("Thanks for your review!");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!rating) { alert("Please select a star rating."); return; }
      var file = form.elements.photo.files[0];
      if (!file) return save("");
      var rd = new FileReader();
      rd.onload = function () {
        var img = new Image();
        img.onload = function () {
          var s = Math.min(1, 400 / Math.max(img.width, img.height)), cv = document.createElement("canvas");
          cv.width = img.width * s; cv.height = img.height * s; cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
          save(cv.toDataURL("image/jpeg", .75));
        };
        img.onerror = function () { save(""); }; img.src = rd.result;
      };
      rd.readAsDataURL(file);
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", function () {
    initReviews(); initSlider(); initCarousels();
    updateCount(); initHeader(); initButtons(); initListing(); initProduct();
    initCart(); initCheckout(); initSuccess(); initTrack(); initAccount(); initMessageForms();
  });
  window.addEventListener("storage", updateCount);
})();
