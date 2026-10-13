/* Kicksglow – product data
   Real photos lagane ke liye kisi product me  images:["img/xyz-1.jpg","img/xyz-2.jpg"]  add kar do.
   Jab tak images nahi hain, neeche ka placeholder auto-generate hota hai. */
const BRAND = {
  name: 'Kicksglow',
  tagline: 'Every Step Shines',
  phone: '8929635309',
  email: 'shoyabswag786@gmail.com',
  address: 'Roshan Nagar, Faridabad, Haryana 121003',
  // Apne asli social page links yahan daalo
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
    whatsapp: 'https://wa.me/918929635309'
  }
};

const CATS = [
  { id: 'all',     name: 'All Products',   e: '🛍️' },
  { id: 'crates',  name: 'Crates',         e: '📦' },
  { id: 'kits',    name: 'Cleaning Kits',  e: '🧼' },
  { id: 'wipes',   name: 'Wipes',          e: '🧻' },
  { id: 'insoles', name: 'Insoles',        e: '👟' },
  { id: 'care',    name: 'Care & Protect', e: '🧴' }
];
const EMOJI = { crates: '📦', kits: '🧼', wipes: '🧻', insoles: '👟', care: '🧴' };

/* concern: care | protect | storage  (home page "Shop By Concern" tabs) */
const PRODUCTS = [
  { id: 'crate-black', name: 'Kicksglow Stack\'Em Sneaker Crate | Black', cat: 'crates', concern: 'storage', price: 1239, mrp: 2000, rating: 4.9, reviews: 112, best: true,
    desc: 'Stackable sneaker crate with a clear magnetic door. Keeps dust out and your pair on display.',
    inside: ['1 x Stackable crate', 'Magnetic door panel', 'Assembly guide'] },
  { id: 'crate-clear', name: 'Kicksglow Stack\'Em Sneaker Crate | Clear', cat: 'crates', concern: 'storage', price: 1299, mrp: 2000, rating: 4.9, reviews: 112,
    desc: 'Fully transparent crate for collectors who want every pair visible.', inside: ['1 x Stackable crate', 'Magnetic door panel'] },
  { id: 'crate-white', name: 'Kicksglow Stack\'Em Sneaker Crate | White', cat: 'crates', concern: 'storage', price: 1239, mrp: 2000, rating: 4.9, reviews: 112,
    desc: 'Clean white finish that suits any shelf or wardrobe.', inside: ['1 x Stackable crate', 'Magnetic door panel'] },
  { id: 'crate-red', name: 'Kicksglow Stack\'Em Sneaker Crate | Red', cat: 'crates', concern: 'storage', price: 1239, mrp: 2000, rating: 4.9, reviews: 112, soldout: true,
    desc: 'Bold red crate. Currently out of stock.', inside: ['1 x Stackable crate'] },
  { id: 'door-panel', name: 'Replacement Door Panel Only', cat: 'crates', concern: 'storage', price: 764, mrp: 899, rating: 5.0, reviews: 3, soldout: true,
    desc: 'Spare magnetic door panel for Stack\'Em crates.', inside: ['1 x Door panel'] },

  { id: 'rpl-spray-200', name: 'Kicksglow RPL Water & Stain Repellent Spray 200ml', cat: 'care', concern: 'protect', price: 749, mrp: 1799, rating: 4.9, reviews: 89, best: true,
    desc: 'Invisible shield against water, mud and stains for suede, canvas, leather and knit.', inside: ['1 x 200ml spray'] },
  { id: 'rpl-spray-100', name: 'Kicksglow RPL Water & Stain Repellent Spray 100ml', cat: 'care', concern: 'protect', price: 499, mrp: 1199, rating: 4.9, reviews: 120,
    desc: 'Travel-size repellent spray, same protection as the 200ml.', inside: ['1 x 100ml spray'] },
  { id: 'sole-guard', name: 'Kicksglow Sole Guard', cat: 'care', concern: 'protect', price: 499, mrp: 1099, rating: 4.8, reviews: 44,
    desc: 'Clear protective film that keeps soles from yellowing and scuffing.', inside: ['Sole guard set'] },
  { id: 'sole-saver', name: 'Kicksglow Sole Saver 100ml', cat: 'care', concern: 'protect', price: 799, mrp: 1099, rating: 5.0, reviews: 25,
    desc: 'Restores and protects worn soles.', inside: ['1 x 100ml bottle', 'Applicator'] },
  { id: 'leather-cond', name: 'Kicksglow Leather Conditioner 100ml', cat: 'care', concern: 'care', price: 599, mrp: 899, rating: 5.0, reviews: 13,
    desc: 'Feeds and softens leather to prevent cracking.', inside: ['1 x 100ml bottle'] },
  { id: 'shaper', name: 'Kicksglow Shoe Shaper', cat: 'care', concern: 'protect', price: 299, mrp: 499, rating: 4.9, reviews: 60,
    desc: 'Keeps the toe box crease-free between wears.', inside: ['1 pair of shapers'] },
  { id: 'deodoriser', name: 'Kicksglow Deodoriser Pills', cat: 'care', concern: 'care', price: 399, mrp: 999, rating: 4.9, reviews: 148,
    desc: 'Drop-in pills that absorb odour inside shoes and bags.', inside: ['1 pair of pills'] },
  { id: 'formula-100', name: 'Kicksglow Shoe Cleaning Formula 100ml', cat: 'care', concern: 'care', price: 299, mrp: 599, rating: 4.9, reviews: 16,
    desc: 'Gentle foaming formula for everyday shoe cleaning.', inside: ['1 x 100ml bottle'] },

  { id: 'kit-basic', name: 'Kicksglow Basic Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 499, mrp: 1099, rating: 4.8, reviews: 87, best: true,
    desc: 'Cleaning formula plus brush. The easiest way to start.', inside: ['Cleaning formula', 'Brush'] },
  { id: 'kit-essential', name: 'Kicksglow Essential Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 799, mrp: 1299, rating: 4.8, reviews: 32, best: true,
    desc: 'Formula, brush and microfibre towel for a full clean.', inside: ['Cleaning formula', 'Brush', 'Microfibre towel'] },
  { id: 'kit-complete', name: 'Kicksglow Complete Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 1199, mrp: 2499, rating: 4.9, reviews: 130, best: true,
    images: ['img/products/kit-complete-1.jpg', 'img/products/kit-complete-2.jpg', 'img/products/kit-complete-3.jpg', 'img/products/kit-complete-4.jpg'],
    desc: 'Everything you need to clean, protect and refresh any pair.', inside: ['Cleaning formula', 'Brush set', 'Towel', 'Repellent spray'] },
  { id: 'kit-travel', name: 'Kicksglow Travel Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 999, mrp: 1999, rating: 4.9, reviews: 27, best: true,
    desc: 'Compact zip case with a mini cleaning set for on-the-go touch-ups.', inside: ['Zip case', 'Mini formula', 'Brush', 'Towel'] },
  { id: 'kit-quick', name: 'Kicksglow Quick Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 299, mrp: 499, rating: 4.9, reviews: 155, best: true,
    desc: 'Foam cleaner and brush, ready in a minute.', inside: ['Foam cleaner', 'Brush'] },
  { id: 'kit-6in1', name: 'Kicksglow 6 in 1 Shoe Care Kit', cat: 'kits', concern: 'care', price: 1299, mrp: 2499, rating: 4.9, reviews: 35, best: true,
    desc: 'Clean, protect and polish. Six essentials in one box.', inside: ['Formula', 'Brush', 'Towel', 'Repellent spray', 'Deodoriser', 'Shaper'] },
  { id: 'kit-suede', name: 'Kicksglow Suede & Nubuck Cleaning Kit', cat: 'kits', concern: 'care', price: 799, mrp: 999, rating: 4.9, reviews: 24,
    desc: 'Eraser and brush set made for suede and nubuck.', inside: ['Suede eraser', 'Suede brush'] },
  { id: 'kit-turbo', name: 'Kicksglow Turbo Shoe Cleaning Kit', cat: 'kits', concern: 'care', price: 1199, mrp: 1999, rating: 4.8, reviews: 9,
    desc: 'Heavy-duty kit for stubborn dirt.', inside: ['Formula', 'Stiff brush', 'Towel'] },
  { id: 'towel', name: 'Kicksglow Microfibre Towel', cat: 'kits', concern: 'care', price: 499, mrp: 599, rating: 4.7, reviews: 6,
    desc: 'Soft, lint-free towel for drying and buffing.', inside: ['1 x towel'] },
  { id: 'brush-med', name: 'Kicksglow Shoe Cleaning Brush | Medium', cat: 'kits', concern: 'care', price: 249, mrp: 599, rating: 4.8, reviews: 4,
    desc: 'Medium bristle brush for everyday cleaning.', inside: ['1 x brush'] },

  { id: 'wipes-24', name: 'Kicksglow Shoe Cleaning Wipes (Pack of 24)', cat: 'wipes', concern: 'care', price: 649, mrp: 1099, rating: 4.9, reviews: 274, best: true,
    desc: 'Pop-up wipes that lift dirt from midsoles and uppers in seconds.', inside: ['24 wipes'] },
  { id: 'wipes-xl', name: 'Kicksglow XL Shoe Cleaning Wipes 24 Pcs', cat: 'wipes', concern: 'care', price: 999, mrp: 1599, rating: 4.9, reviews: 29,
    desc: 'Extra-large wipes for bigger pairs and boots.', inside: ['24 XL wipes'] },
  { id: 'wipes-50', name: 'Kicksglow Multipack Shoe Cleaning Wipes 50 Pcs', cat: 'wipes', concern: 'care', price: 299, mrp: 599, rating: 4.9, reviews: 43,
    desc: 'Value multipack for regular cleaning.', inside: ['50 wipes'] },
  { id: 'wipes-6', name: 'Kicksglow Shoe Cleaning Wipes 6 Pcs', cat: 'wipes', concern: 'care', price: 329, mrp: 359, rating: 4.9, reviews: 136,
    desc: 'Small pack for your bag or gym locker.', inside: ['6 wipes'] },

  { id: 'insole-cloud', name: 'Kicksglow CloudSole Memory Foam Insoles', cat: 'insoles', concern: 'care', price: 599, mrp: 999, rating: 5.0, reviews: 3, variants: ['Small', 'Large'],
    desc: 'Memory foam insoles for all-day cushioning.', inside: ['1 pair of insoles'] },
  { id: 'insole-dualgel', name: 'Kicksglow Dual Gel Performance Insole', cat: 'insoles', concern: 'care', price: 699, mrp: 1299, rating: 5.0, reviews: 6, best: true, variants: ['Small', 'Large'],
    desc: 'Dual gel pods absorb shock at the heel and forefoot. Trim to fit your shoe.',
    inside: ['1 pair of insoles', 'Trim guide'] },
  { id: 'insole-allday', name: 'Kicksglow All Day Insole (UK 7-11.5)', cat: 'insoles', concern: 'care', price: 799, mrp: 999, rating: 4.9, reviews: 12,
    desc: 'Supportive everyday insole for work and travel.', inside: ['1 pair of insoles'] }
];

/* ---------- images ----------
   Har product ki 4 images:  img/products/<product-id>-1.svg ... -4.svg
   Asli photo lagane ke liye: same naam se .jpg rakho aur product me  images:["img/products/<id>-1.jpg", ...]  likho
   (ya sirf is function me extension badal do). */
// Apni photos img/products/ me daalne ke baad yahan 'jpg' (ya 'png' / 'webp') kar do.
// Jo photo nahi milegi uski jagah placeholder (.svg) apne aap dikhega.
const IMG_EXT = 'svg';
function imgFor(p, i = 0) {
  if (p.images && p.images[i]) return p.images[i];
  return `img/products/${p.id}-${(i % 4) + 1}.${IMG_EXT}`;
}
