KICKSGLOW WEBSITE
=================
Kholne ke liye: index.html par double click karo (ya VS Code Live Server).

Pages: index (Home), products, product?id=... (Details), checkout, success, about, contact
Theme color: css/style.css me  --lime:#95CA31   (darker hover: --lime-d:#7FB021)
Products edit/add: js/data.js
Brand details (phone/email/address): js/data.js ke upar BRAND + about/contact/index html

HERO IMAGES: img/hero/slide-1.png, slide-2.png, slide-3.png (abhi teeno me ek hi banner hai, apni 3 images isi naam se replace karo; size 1584x672 jaisi wide image best)

IMAGES FOLDER
  img/products/<product-id>-1.svg ... -4.svg   (har product ki 4 images)
  img/hero/    slide-1/2/3.svg, promo.svg       (home page banners)
  img/about/   story.svg, feature.svg
Asli photos lagane ke liye: product ki photos img/products/ me daalo aur js/data.js me us product me
  images:["img/products/crate-black-1.jpg","img/products/crate-black-2.jpg", ...]
likho. Placeholder dobara banane ke liye:  node tools/make-images.js

Note: Cart aur orders browser (localStorage) me save hote hain. Real orders/online payment ke liye
backend ya Razorpay jaisa service connect karna padega.

PRODUCT PHOTOS (asli images)
1. Har product ki photo  img/products/<product-id>-1.jpg  (aur chaho to -2, -3, -4) naam se rakho. Product ids js/data.js me hain (jaise crate-black, kit-complete).
2. js/data.js me  const IMG_EXT = 'svg';  ko  'jpg'  kar do.
Jis photo ka file nahi hoga uski jagah placeholder apne aap dikhega.
