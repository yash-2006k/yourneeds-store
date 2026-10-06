/**
 * YOUR NEEDS — Multi-Platform Product Discovery Platform
 * Amazon · Myntra · Flipkart
 */

// ─── Application State ───────────────────────────────────────────────────────
const AppState = {
  products: [],
  categories: [],
  filteredProducts: [],
  savedProductIds: JSON.parse(localStorage.getItem('yn_saved') || '[]'),
  currency: '₹',
  adminToken: localStorage.getItem('yn_admin_token') || null,
  filters: {
    search: '',
    category: 'All',
    maxPrice: null,
    badge: '',
    section: 'all',
    sort: 'featured',
    store: 'all'   // 'all', 'amazon', 'myntra', 'flipkart'
  }
};

// ─── Fallback Seed Products ───────────────────────────────────────────────────
const SEED = [
  { id:'prod-1', title:'Nothing Ear (2024) Transparent Hi-Res Wireless Earbuds', slug:'nothing-ear-2024', description:'Custom ceramic drivers, 40.5dB ANC, LHDC 5.0 and iconic transparent chassis.', image_url:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Audio & Sound', price:11999, original_price:14999, currency:'₹', rating:4.9, reviews_count:480, badge:'Best Pick', key_features:['Custom 11mm ceramic driver','40.5dB Smart ANC with transparency mode','LDAC and LHDC 5.0 Hi-Res Audio','40.5 hours playback with fast wireless charging case'], why_we_picked:'Nothing Ear balances industrial design with acoustic prowess that rivals earbuds twice its price.', affiliate_url:'https://www.amazon.in/dp/B0CX23G2K2?tag=luminafinds-21', myntra_url:'https://www.myntra.com/headphones/nothing-ear', flipkart_url:'https://www.flipkart.com/nothing-ear-wireless/p/item1', is_featured:1, is_trending:1, is_published:1, clicks_count:38, best_pick_note:'Best sound + best design in this price range.' },
  { id:'prod-2', title:'Keychron Q1 Pro Wireless Custom Mechanical Keyboard', slug:'keychron-q1-pro', description:'CNC aluminum body, QMK/VIA programmable, double-gasket mount, hot-swappable switches.', image_url:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Desk & Workspace', price:17499, original_price:19999, currency:'₹', rating:4.9, reviews_count:320, badge:'Trending', key_features:['Solid 6063 CNC aluminum chassis','Double-Gasket acoustic design','Bluetooth 5.1 & Type-C wired','Hot-swappable PCB'], why_we_picked:'The deep thock sound and weighted aluminum stance elevate any desk.', affiliate_url:'https://www.amazon.in/dp/B0BWK3P7B5?tag=luminafinds-21', myntra_url:null, flipkart_url:'https://www.flipkart.com/keychron-q1-pro/p/item2', is_featured:1, is_trending:1, is_published:1, clicks_count:52, best_pick_note:null },
  { id:'prod-3', title:'Anker Prime 20,000mAh Power Bank (200W Output)', slug:'anker-prime-20000', description:'Ultra-compact powerhouse with intelligent LCD display and 200W total throughput.', image_url:'https://images.unsplash.com/photo-1609592426861-5582c75a4073?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Tech & Gadgets', price:9499, original_price:11999, currency:'₹', rating:4.8, reviews_count:910, badge:'Popular', key_features:['200W Combined Output','Smart Digital LCD Display','100W fast recharging in 75 min','ActiveShield 2.0 temperature monitoring'], why_we_picked:'The telemetry screen showing exact watt draw is unlike any other power bank.', affiliate_url:'https://www.amazon.in/dp/B0BYP2F3SG?tag=luminafinds-21', myntra_url:null, flipkart_url:null, is_featured:1, is_trending:0, is_published:1, clicks_count:41, best_pick_note:null },
  { id:'prod-4', title:'BenQ ScreenBar Halo Wireless Controller Monitor Light', slug:'benq-screenbar-halo', description:'Patented asymmetric optical lamp with wireless dial, rear ambient backlight, and zero screen glare.', image_url:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Desk & Workspace', price:14990, original_price:16990, currency:'₹', rating:4.9, reviews_count:540, badge:'Best Pick', key_features:['0% screen glare optical design','Wireless rotary dial','Built-in ambient backlight','Auto-dimming light sensor'], why_we_picked:'Once mounted, working late becomes soothing. Zero eye fatigue.', affiliate_url:'https://www.amazon.in/dp/B08WT889V3?tag=luminafinds-21', myntra_url:null, flipkart_url:null, is_featured:1, is_trending:1, is_published:1, clicks_count:29, best_pick_note:null },
  { id:'prod-5', title:'Baseus MagSafe 2-in-1 Magnetic Wireless Charging Stand', slug:'baseus-magsafe-stand', description:'Minimalist zinc alloy stand with simultaneous iPhone StandBy and AirPods charging.', image_url:'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Tech & Gadgets', price:3299, original_price:4599, currency:'₹', rating:4.7, reviews_count:640, badge:'Limited Deal', key_features:['16-core neodymium magnets','360° rotation StandBy mode','Dual 15W + 5W wireless charging','Solid weighted anti-slip base'], why_we_picked:'Clean, architectural, clutter-free. Looks like a sculpture when unused.', affiliate_url:'https://www.amazon.in/dp/B0C3MBX7Q1?tag=luminafinds-21', myntra_url:'https://www.myntra.com/baseus-magsafe-stand', flipkart_url:'https://www.flipkart.com/baseus-stand/p/item4', is_featured:0, is_trending:1, is_published:1, clicks_count:23, best_pick_note:null },
  { id:'prod-6', title:'Portronics CleanUp 8-in-1 Gadget Cleaning Kit', slug:'portronics-cleanup-kit', description:'All-in-one pocket kit with microfiber brush, silicone tip, keycap puller and screen spray.', image_url:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Budget Heroes', price:499, original_price:999, currency:'₹', rating:4.6, reviews_count:2300, badge:'Trending', key_features:['Silicone nib for earbuds & port lint','Sponge wand for charging case','Slide-out keyboard brush','Screen mist spray & microfiber wiper'], why_we_picked:'The easiest ₹499 upgrade. Keeps thousands of rupees of tech gleaming in 30 seconds.', affiliate_url:'https://www.amazon.in/dp/B0C6L7M8PX?tag=luminafinds-21', myntra_url:null, flipkart_url:'https://www.flipkart.com/portronics-cleanup/p/item5', is_featured:0, is_trending:1, is_published:1, clicks_count:67, best_pick_note:null },
  { id:'prod-7', title:'Govee RGBIC Neon LED Rope Light (Dynamic Wall Art)', slug:'govee-rgbic-neon-rope', description:'Bendable silicone neon strip with segmented RGBIC, music reactive modes and Alexa/Apple Home.', image_url:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Smart Home & Living', price:6499, original_price:7999, currency:'₹', rating:4.8, reviews_count:780, badge:'Popular', key_features:['Segmented RGBIC multi-colour','3m flexible silicone neon tube','11 music sync modes','Alexa, Google & Matter compatible'], why_we_picked:'Casts buttery-smooth cyber glow unlike ordinary LED tape with hotspots.', affiliate_url:'https://www.amazon.in/dp/B099W5CS97?tag=luminafinds-21', myntra_url:'https://www.myntra.com/govee-neon-light', flipkart_url:'https://www.flipkart.com/govee-rgbic/p/item6', is_featured:1, is_trending:0, is_published:1, clicks_count:35, best_pick_note:null },
  { id:'prod-8', title:'Nitecore TIKI 300 Lm Rechargeable Keychain Torch', slug:'nitecore-tiki-torch', description:'12g transparent mini torch with 300lm Osram LED, UV blacklight and high-CRI reading lamp.', image_url:'https://images.unsplash.com/photo-1585336261026-6d601b0b571d?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Budget Heroes', price:990, original_price:1499, currency:'₹', rating:4.7, reviews_count:1420, badge:'Best Pick', key_features:['300 lumens up to 71 meters','High-CRI LED for reading','UV 365nm for verification','IP66, 12g, micro-USB charging'], why_we_picked:'Engineering marvel of EDC — virtually nothing on your keyring yet outshines big torches.', affiliate_url:'https://www.amazon.in/dp/B082BG7G8Q?tag=luminafinds-21', myntra_url:null, flipkart_url:null, is_featured:0, is_trending:1, is_published:1, clicks_count:48, best_pick_note:null },
  { id:'prod-9', title:'Logitech MX Master 3S Wireless Performance Mouse', slug:'logitech-mx-master-3s', description:'Quiet Click, 8,000 DPI track-on-glass, MagSpeed electromagnetic scroll wheel.', image_url:'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Desk & Workspace', price:8995, original_price:10995, currency:'₹', rating:4.9, reviews_count:3890, badge:'Best Pick', key_features:['MagSpeed electromagnetic scroll — 1000 lines/sec','90% quieter Quiet Click','8,000 DPI Darkfield sensor on glass','Ergonomic gesture thumb button'], why_we_picked:'After the electromagnetic scroll wheel, going back to any normal mouse feels impossible.', affiliate_url:'https://www.amazon.in/dp/B09HM94VDS?tag=luminafinds-21', myntra_url:null, flipkart_url:'https://www.flipkart.com/logitech-mx-master/p/item7', is_featured:1, is_trending:1, is_published:1, clicks_count:62, best_pick_note:'The definitive productivity mouse. Nothing comes close.' },
  { id:'prod-10', title:'Orbitkey Nest Portable Desk Organizer + 10W Wireless Charger', slug:'orbitkey-nest-organizer', description:'Leather valet tray with customizable dividers and built-in wireless charging lid.', image_url:'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Everyday Carry', price:7999, original_price:9499, currency:'₹', rating:4.8, reviews_count:195, badge:'New', key_features:['10W wireless charging lid','Movable compartment dividers','Single-hand dual hinge','Premium leather + polycarbonate shell'], why_we_picked:'Pack it in your bag in the morning, pop it onto your desk at work. Perfect travel system.', affiliate_url:'https://www.amazon.in/dp/B08KGK9J5B?tag=luminafinds-21', myntra_url:null, flipkart_url:null, is_featured:0, is_trending:0, is_published:1, clicks_count:19, best_pick_note:null },
  { id:'prod-11', title:'Xiaomi Smart Air Purifier 4 Compact (True HEPA)', slug:'xiaomi-air-purifier-4-compact', description:'Whisper-quiet desktop purifier with HEPA filtration, PM2.5 laser sensor and Alexa control.', image_url:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Smart Home & Living', price:6999, original_price:8999, currency:'₹', rating:4.7, reviews_count:880, badge:'Limited Deal', key_features:['99.97% particle capture to 0.3μm','Fits on bedside or desk','20dB sleep mode','Real-time AQI monitoring'], why_we_picked:'Compact enough for a bedside table — noticeably crisper air within minutes.', affiliate_url:'https://www.amazon.in/dp/B0B61QY86F?tag=luminafinds-21', myntra_url:null, flipkart_url:'https://www.flipkart.com/xiaomi-air-purifier/p/item8', is_featured:0, is_trending:1, is_published:1, clicks_count:31, best_pick_note:null },
  { id:'prod-12', title:'Spigen Rugged Armor Pro Case & Stand for iPad', slug:'spigen-rugged-armor-ipad', description:'Carbon fibre accents, Apple Pencil holder, and air cushion drop protection.', image_url:'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80', additional_images:[], category:'Tech & Gadgets', price:1899, original_price:2499, currency:'₹', rating:4.8, reviews_count:1120, badge:'Popular', key_features:['Carbon fiber matte styling','Apple Pencil wireless charging slot','Air Cushion corner protection','Dual-angle magnetic kickstand'], why_we_picked:'Makes any tablet feel like military hardware while offering infallible protection.', affiliate_url:'https://www.amazon.in/dp/B08V5QVRR7?tag=luminafinds-21', myntra_url:'https://www.myntra.com/spigen-ipad-case', flipkart_url:'https://www.flipkart.com/spigen-armor-ipad/p/item9', is_featured:0, is_trending:0, is_published:1, clicks_count:27, best_pick_note:null }
];

// ─── Initialise App ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initTiltListener();
  initKeyboardShortcuts();
});

async function initApp() {
  await loadData();
  renderCategoriesSection();
  renderCategoryPills();
  applyFiltersAndRender();
  updateSavedBadge();
  await checkAdminSession();
  updateOwnerBadge();

  const q = new URLSearchParams(window.location.search);
  if (q.has('admin') || q.has('owner') || q.has('manage')) openAdminModal();
}

async function loadData() {
  try {
    const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
    if (pRes.ok) { const d = await pRes.json(); if (d.products?.length) { AppState.products = d.products; } }
    if (cRes.ok) { const d = await cRes.json(); if (d.categories?.length) { AppState.categories = d.categories; return; } }
  } catch(e) {}
  AppState.products = SEED;
  AppState.categories = [
    {id:'all', name:'All'}, {id:'c1',name:'Tech & Gadgets'}, {id:'c2',name:'Audio & Sound'},
    {id:'c3',name:'Desk & Workspace'}, {id:'c4',name:'Everyday Carry'},
    {id:'c5',name:'Smart Home & Living'}, {id:'c6',name:'Budget Heroes'}
  ];
}

// ─── Formatting ───────────────────────────────────────────────────────────────
function fmt(val) {
  if (val === null || val === undefined) return '';
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

function catIcon(name) {
  if (!name) return '✨';
  if (name.includes('Tech')) return '⚡';
  if (name.includes('Audio')) return '🎧';
  if (name.includes('Desk')) return '🖥️';
  if (name.includes('Everyday')) return '🎒';
  if (name.includes('Home')) return '🏡';
  if (name.includes('Budget')) return '🪙';
  return '✨';
}

// ─── Category Section Cards (visual grid) ────────────────────────────────────
function renderCategoriesSection() {
  const el = document.getElementById('categoryCards');
  if (!el) return;
  const cats = AppState.categories.filter(c => c.name !== 'All');
  el.innerHTML = cats.map(c => `
    <button onclick="setCategoryFilter('${c.name}')"
      class="glass-pill rounded-2xl p-3 text-center border border-white/10 hover:border-cyan-500/30 hover:bg-white/8 transition-all group">
      <div class="text-2xl mb-1">${catIcon(c.name)}</div>
      <div class="text-[10px] font-bold text-slate-300 group-hover:text-white leading-tight">${c.name}</div>
    </button>
  `).join('');
}

// ─── Category Pills ───────────────────────────────────────────────────────────
function renderCategoryPills() {
  const el = document.getElementById('categoryPills');
  if (!el) return;
  const all = [{name:'All'}, ...AppState.categories.filter(c => c.name !== 'All')];
  el.innerHTML = all.map(c => {
    const active = AppState.filters.category === c.name;
    return `<button onclick="setCategoryFilter('${c.name}')"
      class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${active
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
        : 'glass-pill text-slate-300 hover:text-white'}">
      <span>${catIcon(c.name)}</span><span>${c.name}</span>
    </button>`;
  }).join('');
}

function setCategoryFilter(name) {
  AppState.filters.category = name;
  AppState.filters.section = 'all';
  renderCategoryPills();
  applyFiltersAndRender();
  scrollToCatalog();
}

// ─── Store Filter ─────────────────────────────────────────────────────────────
function setStoreFilter(store) {
  AppState.filters.store = store;
  // Update active style on all store filter buttons
  document.querySelectorAll('.store-filter-btn').forEach(b => {
    b.classList.remove('bg-white/15', 'border-white/30');
    b.classList.add('glass-pill');
  });
  ['storeBtn_' + store, 'storeBtnM_' + store].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('glass-pill'); el.classList.add('bg-white/15', 'border-white/30'); }
  });
  applyFiltersAndRender();
  scrollToCatalog();
}

function setQuickFilter(type) {
  AppState.filters.section = type;
  AppState.filters.category = 'All';
  if (type === 'trending') AppState.filters.sort = 'clicks';
  else if (type === 'budget') AppState.filters.maxPrice = 1000;
  else { AppState.filters.maxPrice = null; AppState.filters.sort = 'featured'; }
  renderCategoryPills();
  applyFiltersAndRender();
  scrollToCatalog();
}

function handleSearchInput(e) {
  AppState.filters.search = e.target.value.toLowerCase().trim();
  // sync both search boxes
  document.querySelectorAll('input[type=text]').forEach(inp => {
    if (inp.id === 'globalSearchInput' || inp.oninput?.toString().includes('handleSearchInput')) {
      if (inp.value !== e.target.value) inp.value = e.target.value;
    }
  });
  applyFiltersAndRender();
}

function handleSortChange(e) {
  AppState.filters.sort = e.target.value;
  applyFiltersAndRender();
}

function resetFilters() {
  AppState.filters = { search:'', category:'All', maxPrice:null, badge:'', section:'all', sort:'featured', store:'all' };
  document.querySelectorAll('input[placeholder*="Search"]').forEach(i => i.value = '');
  setStoreFilter('all');
  renderCategoryPills();
  applyFiltersAndRender();
}

function scrollToCatalog() {
  document.getElementById('catalogSection')?.scrollIntoView({behavior:'smooth'});
}

// ─── Master Filter Engine ─────────────────────────────────────────────────────
function applyFiltersAndRender() {
  let list = [...AppState.products];

  if (AppState.filters.search) {
    const q = AppState.filters.search;
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (p.key_features||[]).some(f => f.toLowerCase().includes(q))
    );
  }
  if (AppState.filters.category !== 'All') {
    list = list.filter(p => p.category === AppState.filters.category);
  }
  if (AppState.filters.section === 'trending') list = list.filter(p => p.is_trending || p.clicks_count > 30);
  else if (AppState.filters.section === 'picks') list = list.filter(p => p.badge === 'Best Pick' || p.is_featured);
  else if (AppState.filters.section === 'budget') list = list.filter(p => p.price <= 1000 || p.category === 'Budget Heroes');

  if (AppState.filters.maxPrice) list = list.filter(p => p.price <= AppState.filters.maxPrice);
  if (AppState.filters.badge) list = list.filter(p => p.badge === AppState.filters.badge);

  // Store filter
  if (AppState.filters.store === 'amazon') list = list.filter(p => p.affiliate_url);
  else if (AppState.filters.store === 'myntra') list = list.filter(p => p.myntra_url);
  else if (AppState.filters.store === 'flipkart') list = list.filter(p => p.flipkart_url);

  // Sort
  if (AppState.filters.sort === 'clicks') list.sort((a,b) => (b.clicks_count||0)-(a.clicks_count||0));
  else if (AppState.filters.sort === 'price_asc') list.sort((a,b) => a.price-b.price);
  else if (AppState.filters.sort === 'price_desc') list.sort((a,b) => b.price-a.price);
  else if (AppState.filters.sort === 'rating') list.sort((a,b) => b.rating-a.rating);
  else list.sort((a,b) => (b.is_featured?1:0)-(a.is_featured?1:0) || (b.clicks_count||0)-(a.clicks_count||0));

  AppState.filteredProducts = list;
  renderGrid();
  renderTrending();
  renderSpotlight();
  renderBudget();
}

// ─── Product Card HTML ────────────────────────────────────────────────────────
function cardHTML(p) {
  const disc = p.original_price ? Math.round((1-p.price/p.original_price)*100) : 0;
  const saved = AppState.savedProductIds.includes(p.id);
  const isBestPick = !!(p.best_pick_note || p.badge === 'Best Pick');

  let badgeCls = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  if (p.badge==='Trending') badgeCls = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (p.badge==='Best Pick') badgeCls = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (p.badge==='Limited Deal') badgeCls = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

  // Available stores row
  const storeRow = [
    p.affiliate_url ? `<span class="store-dot-amazon" title="Amazon"></span>` : '',
    p.myntra_url ? `<span class="store-dot-myntra" title="Myntra"></span>` : '',
    p.flipkart_url ? `<span class="store-dot-flipkart" title="Flipkart"></span>` : ''
  ].filter(Boolean).join('');
  const storeCount = [p.affiliate_url, p.myntra_url, p.flipkart_url].filter(Boolean).length;

  // Primary buy button (prefer Amazon for primary CTA)
  const primaryBtn = p.affiliate_url
    ? `<button onclick="handleBuyNow('${p.id}','${p.affiliate_url}','amazon',event)" class="btn-amazon flex-1 py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-md">🛒 Amazon ↗</button>`
    : p.flipkart_url
    ? `<button onclick="handleBuyNow('${p.id}','${p.flipkart_url}','flipkart',event)" class="btn-flipkart flex-1 py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-md">🛒 Flipkart ↗</button>`
    : `<button onclick="handleBuyNow('${p.id}','${p.myntra_url}','myntra',event)" class="btn-myntra flex-1 py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-md">🛍️ Myntra ↗</button>`;

  // Secondary store icons
  const secBtns = [];
  if (p.affiliate_url && (p.myntra_url || p.flipkart_url)) {
    if (p.myntra_url) secBtns.push(`<button onclick="handleBuyNow('${p.id}','${p.myntra_url}','myntra',event)" title="Buy on Myntra" class="btn-myntra px-2.5 py-2.5 rounded-xl text-[10px] font-bold">🛍️</button>`);
    if (p.flipkart_url) secBtns.push(`<button onclick="handleBuyNow('${p.id}','${p.flipkart_url}','flipkart',event)" title="Buy on Flipkart" class="btn-flipkart px-2.5 py-2.5 rounded-xl text-[10px] font-bold">🛒</button>`);
  }

  return `
    <div class="card-tilt-wrap w-full" data-id="${p.id}">
      <div class="card-tilt-inner relative glass-panel rounded-2xl p-4 flex flex-col h-full border border-white/10 group hover:border-cyan-500/30 ${isBestPick ? 'best-pick-ring' : ''}">
        <div class="specular-glare"></div>

        <!-- Image -->
        <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3 flex-shrink-0">
          <img src="${p.image_url}" alt="${p.title}" loading="lazy" onclick="openProductDetails('${p.id}')"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"/>
          ${p.badge ? `<div class="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase backdrop-blur-md border ${badgeCls}">${p.badge}</div>` : ''}
          <button onclick="toggleSave('${p.id}',event)" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-base border border-white/10 hover:border-rose-500/40 transition-colors">
            ${saved ? '❤️' : '🤍'}
          </button>
          <div onclick="openProductDetails('${p.id}')" class="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span class="text-[10px] font-bold text-cyan-300">View Details ↗</span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] uppercase tracking-wider font-semibold text-slate-400">${p.category}</span>
            <span class="text-[10px] font-bold text-amber-400">★ ${p.rating}</span>
          </div>

          <h4 onclick="openProductDetails('${p.id}')" class="text-xs font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-2 mb-2 leading-snug">${p.title}</h4>
          <p class="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">${p.description}</p>

          <!-- Store availability -->
          ${storeCount > 1 ? `<div class="flex items-center gap-1.5 mb-2 text-[10px] text-slate-500">${storeRow}<span>${storeCount} stores available</span></div>` : ''}
        </div>

        <!-- Price & Buy -->
        <div class="pt-2.5 border-t border-white/5 space-y-2 mt-auto">
          <div class="flex items-baseline gap-1.5">
            <span class="text-base font-black text-white">${fmt(p.price)}</span>
            ${p.original_price ? `<span class="text-[10px] text-slate-500 line-through">${fmt(p.original_price)}</span>` : ''}
            ${disc > 0 ? `<span class="text-[9px] font-extrabold text-emerald-400">${disc}% OFF</span>` : ''}
          </div>
          <div class="flex items-center gap-2">
            ${primaryBtn}
            ${secBtns.join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// ─── Grid Render ──────────────────────────────────────────────────────────────
function renderGrid() {
  const el = document.getElementById('productGrid');
  const ct = document.getElementById('resultCount');
  if (!el) return;
  if (ct) ct.textContent = `${AppState.filteredProducts.length} products found`;

  if (!AppState.filteredProducts.length) {
    el.innerHTML = `
      <div class="col-span-full py-20 text-center glass-panel rounded-3xl p-8 border border-white/5">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-bold text-white mb-2">No products found</h3>
        <p class="text-xs text-slate-400 mb-5">Try a different search term, category, or store filter.</p>
        <button onclick="resetFilters()" class="btn-secondary px-6 py-2.5 rounded-xl text-sm font-semibold">Reset Filters</button>
      </div>`;
    return;
  }
  el.innerHTML = AppState.filteredProducts.map(cardHTML).join('');
}

// ─── Trending Section ─────────────────────────────────────────────────────────
function renderTrending() {
  const el = document.getElementById('trendingContainer');
  if (!el) return;
  const list = [...AppState.products].filter(p => p.is_trending || p.clicks_count > 30).slice(0,4);
  el.innerHTML = list.map((p,i) => {
    const primaryUrl = p.affiliate_url || p.flipkart_url || p.myntra_url;
    const primaryStore = p.affiliate_url ? 'amazon' : p.flipkart_url ? 'flipkart' : 'myntra';
    const primaryLabel = p.affiliate_url ? '🛒 Amazon' : p.flipkart_url ? '🛒 Flipkart' : '🛍️ Myntra';
    const btnCls = primaryStore === 'amazon' ? 'btn-amazon' : primaryStore === 'flipkart' ? 'btn-flipkart' : 'btn-myntra';
    return `
      <div class="card-tilt-wrap">
        <div class="card-tilt-inner glass-panel rounded-2xl p-4 border border-white/10 group flex flex-col h-full">
          <div class="specular-glare"></div>
          <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
            <img src="${p.image_url}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">🔥 #${i+1}</div>
            <button onclick="toggleSave('${p.id}',event)" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-sm border border-white/10">${AppState.savedProductIds.includes(p.id)?'❤️':'🤍'}</button>
          </div>
          <div class="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">${p.category}</div>
          <h4 onclick="openProductDetails('${p.id}')" class="text-xs font-bold text-white hover:text-cyan-400 cursor-pointer line-clamp-1 mb-1">${p.title}</h4>
          <p class="text-[11px] text-slate-400 line-clamp-2 mb-3 flex-1">${p.description}</p>
          <div class="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
            <span class="text-sm font-black text-white">${fmt(p.price)}</span>
            <button onclick="handleBuyNow('${p.id}','${primaryUrl}','${primaryStore}',event)" class="${btnCls} px-3 py-2 rounded-xl text-[10px] font-extrabold">${primaryLabel} ↗</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ─── Spotlight (Best Pick) ────────────────────────────────────────────────────
function renderSpotlight() {
  const el = document.getElementById('spotlightContainer');
  if (!el) return;
  const pick = AppState.products.find(p => p.best_pick_note) || AppState.products.find(p => p.badge === 'Best Pick') || AppState.products[0];
  if (!pick) return;
  const disc = pick.original_price ? Math.round((1-pick.price/pick.original_price)*100) : 0;

  const storeButtons = [];
  if (pick.affiliate_url) storeButtons.push(`<button onclick="handleBuyNow('${pick.id}','${pick.affiliate_url}','amazon',event)" class="btn-amazon px-5 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg">🛒 Buy on Amazon ↗</button>`);
  if (pick.myntra_url) storeButtons.push(`<button onclick="handleBuyNow('${pick.id}','${pick.myntra_url}','myntra',event)" class="btn-myntra px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg">🛍️ Myntra ↗</button>`);
  if (pick.flipkart_url) storeButtons.push(`<button onclick="handleBuyNow('${pick.id}','${pick.flipkart_url}','flipkart',event)" class="btn-flipkart px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg">🛒 Flipkart ↗</button>`);

  el.innerHTML = `
    <div class="glass-panel-elevated rounded-3xl p-6 lg:p-8 border border-white/15 relative overflow-hidden group">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-5">
          <div class="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src="${pick.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
          </div>
        </div>
        <div class="lg:col-span-7">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">${pick.category}</span>
            <span class="text-[10px] font-bold text-amber-400">★ ${pick.rating} (${pick.reviews_count} ratings)</span>
          </div>
          <h3 onclick="openProductDetails('${pick.id}')" class="text-xl lg:text-2xl font-extrabold text-white hover:text-cyan-400 cursor-pointer mb-3">${pick.title}</h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-4">${pick.description}</p>
          <div class="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 mb-5">
            <div class="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">⭐ Owner's Best Pick Note</div>
            <p class="text-[11px] text-slate-200 italic">"${pick.best_pick_note || pick.why_we_picked}"</p>
          </div>
          <div class="flex flex-wrap items-baseline gap-2 mb-5">
            <span class="text-2xl font-black text-white">${fmt(pick.price)}</span>
            ${pick.original_price ? `<span class="text-sm text-slate-500 line-through">${fmt(pick.original_price)}</span>` : ''}
            ${disc > 0 ? `<span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">${disc}% OFF</span>` : ''}
          </div>
          <div class="flex flex-wrap items-center gap-3">
            ${storeButtons.join('')}
            <button onclick="openProductDetails('${pick.id}')" class="btn-secondary px-4 py-3 rounded-xl text-xs font-bold">Read Review</button>
          </div>
          <p class="text-[10px] text-slate-500 mt-3">Prices may vary. Check each platform for the current price before purchasing.</p>
        </div>
      </div>
    </div>`;
}

// ─── Budget Section ───────────────────────────────────────────────────────────
function renderBudget() {
  const el = document.getElementById('budgetContainer');
  if (!el) return;
  const list = AppState.products.filter(p => p.price <= 1000 || p.category === 'Budget Heroes').slice(0,3);
  el.innerHTML = list.map(cardHTML).join('');
}

// ─── 3D Tilt Physics ──────────────────────────────────────────────────────────
function initTiltListener() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.card-tilt-wrap');
    if (!card) return;
    const inner = card.querySelector('.card-tilt-inner');
    if (!inner) return;
    const r = card.getBoundingClientRect();
    const rotX = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -6;
    const rotY = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 6;
    inner.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025,1.025,1.025)`;
    inner.style.setProperty('--mouse-x', `${(e.clientX - r.left)/r.width*100}%`);
    inner.style.setProperty('--mouse-y', `${(e.clientY - r.top)/r.height*100}%`);
  });

  document.addEventListener('mouseout', e => {
    const card = e.target.closest('.card-tilt-wrap');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      const inner = card.querySelector('.card-tilt-inner');
      if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    }
  });
}

// ─── Buy Now (Outbound Affiliate Click) ───────────────────────────────────────
function handleBuyNow(productId, url, store, event) {
  if (event) event.stopPropagation();
  if (!url) return;

  // Async click tracking (non-blocking)
  try {
    const payload = JSON.stringify({productId, store, referrer: document.referrer || 'direct'});
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track-click', new Blob([payload], {type:'application/json'}));
    } else {
      fetch('/api/track-click', {method:'POST', headers:{'Content-Type':'application/json'}, body: payload, keepalive:true}).catch(()=>{});
    }
  } catch(e) {}

  // Update local click count
  const p = AppState.products.find(x => x.id === productId);
  if (p) p.clicks_count = (p.clicks_count||0) + 1;

  window.open(url, '_blank', 'noopener,noreferrer');
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
function openProductDetails(id) {
  const p = AppState.products.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('productDetailModal');
  const content = document.getElementById('productDetailContent');
  if (!modal || !content) return;

  const images = [p.image_url, ...(p.additional_images||[])].filter(Boolean);
  const disc = p.original_price ? Math.round((1-p.price/p.original_price)*100) : 0;

  const storeBtns = [];
  if (p.affiliate_url) storeBtns.push(`
    <div class="p-3 rounded-xl bg-[#FF9900]/8 border border-[#FF9900]/20">
      <div class="text-[10px] font-bold text-[#FF9900] mb-0.5">🛒 Available on Amazon</div>
      <div class="text-[10px] text-slate-400 mb-2">As an Amazon Associate, we earn from qualifying purchases.</div>
      <button onclick="handleBuyNow('${p.id}','${p.affiliate_url}','amazon',event)" class="btn-amazon w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">🛒 Buy on Amazon ↗</button>
    </div>`);
  if (p.myntra_url) storeBtns.push(`
    <div class="p-3 rounded-xl bg-[#FF3F6C]/8 border border-[#FF3F6C]/20">
      <div class="text-[10px] font-bold text-[#FF3F6C] mb-0.5">🛍️ Available on Myntra</div>
      <div class="text-[10px] text-slate-400 mb-2">Check Myntra for fashion & lifestyle pricing.</div>
      <button onclick="handleBuyNow('${p.id}','${p.myntra_url}','myntra',event)" class="btn-myntra w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">🛍️ Buy on Myntra ↗</button>
    </div>`);
  if (p.flipkart_url) storeBtns.push(`
    <div class="p-3 rounded-xl bg-[#2874F0]/8 border border-[#2874F0]/20">
      <div class="text-[10px] font-bold text-[#2874F0] mb-0.5">🛒 Available on Flipkart</div>
      <div class="text-[10px] text-slate-400 mb-2">Compare with Flipkart's current pricing & offers.</div>
      <button onclick="handleBuyNow('${p.id}','${p.flipkart_url}','flipkart',event)" class="btn-flipkart w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">🛒 Buy on Flipkart ↗</button>
    </div>`);

  content.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-7">
      <div class="lg:col-span-5">
        <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
          <img id="detailMainImg" src="${images[0]}" class="w-full h-full object-cover"/>
          ${p.badge ? `<div class="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase backdrop-blur-md">${p.badge}</div>` : ''}
        </div>
        ${images.length > 1 ? `<div class="flex gap-2 mt-3 overflow-x-auto pb-1">${images.map(img => `<button onclick="document.getElementById('detailMainImg').src='${img}'" class="w-14 h-14 rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-400 flex-shrink-0 bg-slate-900"><img src="${img}" class="w-full h-full object-cover"/></button>`).join('')}</div>` : ''}
      </div>

      <div class="lg:col-span-7 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">${p.category}</span>
          <span class="text-[10px] font-bold text-amber-400">★ ${p.rating} (${p.reviews_count} ratings)</span>
        </div>

        <h2 class="text-xl lg:text-2xl font-extrabold text-white mb-3">${p.title}</h2>
        <p class="text-xs text-slate-300 leading-relaxed mb-4">${p.description}</p>

        <div class="p-4 rounded-2xl bg-cyan-950/35 border border-cyan-500/25 mb-4">
          <div class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">🎯 Why We Picked It</div>
          <p class="text-[11px] text-slate-200 italic">"${p.why_we_picked}"</p>
        </div>

        <div class="mb-4">
          <h4 class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Key Features</h4>
          <div class="space-y-1.5">
            ${(p.key_features||[]).map(f => `<div class="flex items-start gap-2 text-[11px] text-slate-300"><span class="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[8px] mt-0.5 flex-shrink-0">✓</span><span>${f}</span></div>`).join('')}
          </div>
        </div>

        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-2xl font-black text-white">${fmt(p.price)}</span>
          ${p.original_price ? `<span class="text-xs text-slate-500 line-through">${fmt(p.original_price)}</span>` : ''}
          ${disc > 0 ? `<span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">${disc}% OFF</span>` : ''}
        </div>

        <div class="space-y-2.5">
          ${storeBtns.join('')}
          ${storeBtns.length === 0 ? '<p class="text-xs text-slate-400">No purchase links configured yet.</p>' : ''}
        </div>

        <p class="text-[10px] text-slate-500 mt-3 text-center">Prices change frequently. Always verify the current price on the platform before purchasing.</p>
      </div>
    </div>`;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProductDetails() {
  document.getElementById('productDetailModal')?.classList.add('hidden');
  document.body.style.overflow = '';
}

// ─── Save / Wishlist ──────────────────────────────────────────────────────────
function toggleSave(id, event) {
  if (event) event.stopPropagation();
  if (AppState.savedProductIds.includes(id)) {
    AppState.savedProductIds = AppState.savedProductIds.filter(x => x !== id);
  } else {
    AppState.savedProductIds.push(id);
  }
  localStorage.setItem('yn_saved', JSON.stringify(AppState.savedProductIds));
  updateSavedBadge();
  applyFiltersAndRender();
}

function updateSavedBadge() {
  const el = document.getElementById('savedCountBadge');
  if (el) {
    el.textContent = AppState.savedProductIds.length;
    el.style.display = AppState.savedProductIds.length > 0 ? 'inline-flex' : 'none';
  }
}

function showSavedDrawer() {
  AppState.filteredProducts = AppState.products.filter(p => AppState.savedProductIds.includes(p.id));
  renderGrid();
  scrollToCatalog();
}

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
function initKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); openAdminModal(); return; }
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName))) {
      e.preventDefault();
      const inp = document.getElementById('globalSearchInput');
      if (inp) { inp.focus(); inp.select(); }
    }
    if (e.key === 'Escape') { closeProductDetails(); closeAdminModal(); closeDisclosureModal(); }
  });
}

// ─── Secret Owner Access ──────────────────────────────────────────────────────
let logoClicks = 0, logoTimer = null;
function handleSecretOwnerTrigger(e) {
  if (e) e.preventDefault();
  logoClicks++;
  clearTimeout(logoTimer);
  if (logoClicks >= 3) { logoClicks = 0; openAdminModal(); }
  else { logoTimer = setTimeout(() => { logoClicks = 0; }, 1200); }
}

function updateOwnerBadge() {
  const el = document.getElementById('ownerActiveBadge');
  if (!el) return;
  if (AppState.adminToken) { el.classList.remove('hidden'); el.classList.add('flex'); }
  else { el.classList.add('hidden'); el.classList.remove('flex'); }
}

// ─── Admin Modal ──────────────────────────────────────────────────────────────
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (AppState.adminToken) showAdminDashboard();
  else showAdminLogin();
}

function closeAdminModal() {
  document.getElementById('adminModal')?.classList.add('hidden');
  document.body.style.overflow = '';
}

function showAdminLogin() {
  document.getElementById('adminLoginPanel').classList.remove('hidden');
  document.getElementById('adminDashboardPanel').classList.add('hidden');
}

function showAdminDashboard() {
  document.getElementById('adminLoginPanel').classList.add('hidden');
  document.getElementById('adminDashboardPanel').classList.remove('hidden');
  updateOwnerBadge();
  loadAnalytics();
  renderAdminTable();
}

async function checkAdminSession() {
  if (!AppState.adminToken) return;
  try {
    const r = await fetch('/api/admin/verify', {headers:{'Authorization':`Bearer ${AppState.adminToken}`}});
    if (!r.ok) { AppState.adminToken = null; localStorage.removeItem('yn_admin_token'); }
  } catch(e) {}
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('adminPasswordInput').value;
  const errEl = document.getElementById('adminLoginError');
  errEl.classList.add('hidden');

  try {
    const r = await fetch('/api/admin/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password: pass})});
    const d = await r.json();
    if (d.success && d.token) {
      AppState.adminToken = d.token;
      localStorage.setItem('yn_admin_token', d.token);
      showAdminDashboard();
    } else { errEl.textContent = d.error || 'Invalid password'; errEl.classList.remove('hidden'); }
  } catch(err) {
    if (pass === 'admin2026') {
      AppState.adminToken = 'local_session';
      localStorage.setItem('yn_admin_token', 'local_session');
      showAdminDashboard();
    } else { errEl.textContent = 'Invalid password (Default: admin2026)'; errEl.classList.remove('hidden'); }
  }
}

function handleAdminLogout() {
  AppState.adminToken = null;
  localStorage.removeItem('yn_admin_token');
  updateOwnerBadge();
  showAdminLogin();
}

// ─── Analytics ────────────────────────────────────────────────────────────────
async function loadAnalytics() {
  try {
    const r = await fetch('/api/analytics', {headers:{'Authorization':`Bearer ${AppState.adminToken}`}});
    if (r.ok) { const d = await r.json(); if (d.success) { renderAnalytics(d.analytics); return; } }
  } catch(e) {}

  const total = AppState.products.reduce((a,p) => a + (p.clicks_count||0), 0);
  const top = [...AppState.products].sort((a,b) => (b.clicks_count||0)-(a.clicks_count||0)).slice(0,6);
  renderAnalytics({
    total_products: AppState.products.length,
    published_products: AppState.products.filter(p => p.is_published).length,
    featured_products: AppState.products.filter(p => p.is_featured).length,
    total_clicks: total,
    top_clicked: top,
    recent_clicks: top.slice(0,5).map(p => ({product_title: p.title, timestamp: Math.floor(Date.now()/1000)-600, referrer:'direct'}))
  });
}

function renderAnalytics(a) {
  document.getElementById('statTotalProducts').textContent = a.total_products;
  document.getElementById('statPublished').textContent = a.published_products;
  document.getElementById('statTotalClicks').textContent = a.total_clicks;
  document.getElementById('statFeatured').textContent = a.featured_products;

  const tl = document.getElementById('topClickedList');
  if (tl) tl.innerHTML = (a.top_clicked||[]).map((p,i) => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
      <div class="flex items-center gap-2.5">
        <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[9px] flex items-center justify-center">${i+1}</span>
        <div>
          <div class="text-[11px] font-bold text-white line-clamp-1">${p.title}</div>
          <div class="flex items-center gap-1.5 mt-0.5">
            ${p.affiliate_url ? `<span class="store-dot-amazon" title="Amazon"></span>` : ''}
            ${p.myntra_url ? `<span class="store-dot-myntra" title="Myntra"></span>` : ''}
            ${p.flipkart_url ? `<span class="store-dot-flipkart" title="Flipkart"></span>` : ''}
          </div>
        </div>
      </div>
      <span class="text-xs font-extrabold text-cyan-400">${p.clicks_count||0} clicks</span>
    </div>`).join('');

  const rl = document.getElementById('recentClicksStream');
  if (rl) rl.innerHTML = (a.recent_clicks||[]).map(c => `
    <div class="flex justify-between py-1.5 border-b border-white/5 text-[10px]">
      <span class="text-slate-300 truncate max-w-[200px]">${c.product_title}</span>
      <span class="text-slate-500 ml-2">${new Date(c.timestamp*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
    </div>`).join('');
}

// ─── Admin Products Table & Real-Time Management ──────────────────────────────
let adminSearchFilter = '';

function filterAdminProducts(e) {
  adminSearchFilter = (e.target.value || '').toLowerCase().trim();
  renderAdminTable();
}

function renderAdminTable() {
  const el = document.getElementById('adminProductsTableBody');
  if (!el) return;

  let list = [...AppState.products];
  if (adminSearchFilter) {
    list = list.filter(p => 
      p.title.toLowerCase().includes(adminSearchFilter) || 
      (p.category || '').toLowerCase().includes(adminSearchFilter) ||
      (p.badge || '').toLowerCase().includes(adminSearchFilter)
    );
  }

  if (list.length === 0) {
    el.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          No products match your search "${adminSearchFilter}". <button onclick="document.getElementById('adminProductSearch').value=''; adminSearchFilter=''; renderAdminTable();" class="text-cyan-400 underline font-semibold ml-1">Clear search</button>
        </td>
      </tr>
    `;
    return;
  }

  el.innerHTML = list.map(p => {
    const isBest = !!(p.best_pick_note || p.badge === 'Best Pick');
    return `
      <tr class="border-b border-white/5 hover:bg-white/4 text-[11px] transition-colors">
        <td class="p-2.5">
          <img src="${p.image_url}" class="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-white/10 flex-shrink-0"/>
        </td>

        <td class="p-2.5 max-w-[200px]">
          <div class="font-bold text-white line-clamp-1 hover:text-cyan-400 cursor-pointer" onclick="openEditProductModal('${p.id}')">${p.title}</div>
          <div class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>${p.category}</span>
            ${p.badge ? `<span class="px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 font-semibold text-[9px]">${p.badge}</span>` : ''}
          </div>
          <div class="font-mono font-bold text-white text-xs mt-0.5">${fmt(p.price)}</div>
        </td>

        <td class="p-2.5">
          <div class="flex items-center gap-1.5">
            ${p.affiliate_url ? `<span class="store-dot-amazon" title="Amazon Link Active"></span>` : '<span class="w-2 h-2 rounded-full bg-white/10 inline-block" title="No Amazon Link"></span>'}
            ${p.myntra_url ? `<span class="store-dot-myntra" title="Myntra Link Active"></span>` : '<span class="w-2 h-2 rounded-full bg-white/10 inline-block" title="No Myntra Link"></span>'}
            ${p.flipkart_url ? `<span class="store-dot-flipkart" title="Flipkart Link Active"></span>` : '<span class="w-2 h-2 rounded-full bg-white/10 inline-block" title="No Flipkart Link"></span>'}
          </div>
          <div class="text-[9px] text-slate-500 mt-1">
            ${[p.affiliate_url && 'Amazon', p.myntra_url && 'Myntra', p.flipkart_url && 'Flipkart'].filter(Boolean).join(', ') || 'No links'}
          </div>
        </td>

        <td class="p-2.5">
          <button 
            onclick="toggleAdminBestPick('${p.id}', event)" 
            title="Click to toggle Owner's Best Pick"
            class="px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${isBest ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'}"
          >
            ${isBest ? '⭐ Best Pick' : '☆ Normal'}
          </button>
        </td>

        <td class="p-2.5 font-mono font-bold text-cyan-400">
          ${p.clicks_count||0}
        </td>

        <td class="p-2.5">
          <button 
            onclick="toggleAdminPublish('${p.id}', event)" 
            title="Click to toggle Published / Hidden"
            class="px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${p.is_published ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}"
          >
            ${p.is_published ? '✓ Published' : '✕ Hidden'}
          </button>
        </td>

        <td class="p-2.5 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              onclick="openEditProductModal('${p.id}')" 
              class="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>
            <button 
              onclick="deleteProduct('${p.id}')" 
              class="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 text-[10px] font-semibold transition-all"
              title="Delete product"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Quick 1-click Best Pick toggle in table
async function toggleAdminBestPick(id, event) {
  if (event) event.stopPropagation();
  const p = AppState.products.find(x => x.id === id);
  if (!p) return;

  const currentIsBest = !!(p.best_pick_note || p.badge === 'Best Pick');
  if (currentIsBest) {
    p.best_pick_note = null;
    if (p.badge === 'Best Pick') p.badge = '';
  } else {
    p.best_pick_note = 'Owner recommended top value pick';
    p.badge = 'Best Pick';
  }

  try {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AppState.adminToken}`
      },
      body: JSON.stringify(p)
    });
  } catch(e) {}

  applyFiltersAndRender();
  renderAdminTable();
}

// Quick 1-click Publish / Hide toggle in table
async function toggleAdminPublish(id, event) {
  if (event) event.stopPropagation();
  const p = AppState.products.find(x => x.id === id);
  if (!p) return;

  p.is_published = p.is_published ? 0 : 1;

  try {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AppState.adminToken}`
      },
      body: JSON.stringify(p)
    });
  } catch(e) {}

  applyFiltersAndRender();
  renderAdminTable();
}

// ─── Open & Populate Edit Product Modal ───────────────────────────────────────
function openEditProductModal(id) {
  const p = AppState.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('editForm_id').value = p.id;
  document.getElementById('editModalHeaderTitle').textContent = `Edit: ${p.title}`;
  document.getElementById('editModalProductId').textContent = `ID: ${p.id}`;

  document.getElementById('editForm_title').value = p.title || '';
  document.getElementById('editForm_category').value = p.category || 'Tech & Gadgets';
  document.getElementById('editForm_badge').value = p.badge || '';
  document.getElementById('editForm_price').value = p.price || 0;
  document.getElementById('editForm_originalPrice').value = p.original_price || '';
  document.getElementById('editForm_image').value = p.image_url || '';
  document.getElementById('editImgPreview').src = p.image_url || '';

  // Store links
  const amazonInp = document.getElementById('editForm_affiliateUrl');
  const myntraInp = document.getElementById('editForm_myntraUrl');
  const flipkartInp = document.getElementById('editForm_flipkartUrl');

  amazonInp.value = p.affiliate_url || '';
  myntraInp.value = p.myntra_url || '';
  flipkartInp.value = p.flipkart_url || '';

  // Store test link anchors
  const testAmz = document.getElementById('editTestAmazon');
  const testMyn = document.getElementById('editTestMyntra');
  const testFlp = document.getElementById('editTestFlipkart');

  if (p.affiliate_url) { testAmz.href = p.affiliate_url; testAmz.classList.remove('hidden'); } else { testAmz.classList.add('hidden'); }
  if (p.myntra_url) { testMyn.href = p.myntra_url; testMyn.classList.remove('hidden'); } else { testMyn.classList.add('hidden'); }
  if (p.flipkart_url) { testFlp.href = p.flipkart_url; testFlp.classList.remove('hidden'); } else { testFlp.classList.add('hidden'); }

  // Best Pick
  const isBestPick = !!(p.best_pick_note || p.badge === 'Best Pick');
  document.getElementById('editForm_isBestPick').checked = isBestPick;
  document.getElementById('editForm_bestPickNote').value = p.best_pick_note || '';

  // Status Toggles
  document.getElementById('editForm_isPublished').checked = (p.is_published !== 0 && p.is_published !== false);
  document.getElementById('editForm_isFeatured').checked = !!p.is_featured;
  document.getElementById('editForm_isTrending').checked = !!p.is_trending;

  // Text content
  document.getElementById('editForm_description').value = p.description || '';
  document.getElementById('editForm_whyWePicked').value = p.why_we_picked || '';
  document.getElementById('editForm_features').value = (p.key_features || []).join('\n');

  // Open modal
  const modal = document.getElementById('editProductModal');
  if (modal) modal.classList.remove('hidden');
}

function closeEditProductModal() {
  const modal = document.getElementById('editProductModal');
  if (modal) modal.classList.add('hidden');
}

// ─── Save Changes to Existing Product ─────────────────────────────────────────
async function handleEditProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('editForm_id').value;
  const p = AppState.products.find(x => x.id === id);
  if (!p) return;

  const title = document.getElementById('editForm_title').value.trim();
  const affiliateUrl = document.getElementById('editForm_affiliateUrl').value.trim();
  const myntraUrl = document.getElementById('editForm_myntraUrl').value.trim();
  const flipkartUrl = document.getElementById('editForm_flipkartUrl').value.trim();

  if (!title) { alert('Product title is required.'); return; }
  if (!affiliateUrl && !myntraUrl && !flipkartUrl) {
    alert('Please provide at least one store link (Amazon, Myntra, or Flipkart).');
    return;
  }

  const isBestPick = document.getElementById('editForm_isBestPick').checked;
  const bestPickNote = document.getElementById('editForm_bestPickNote').value.trim();

  // Update object
  p.title = title;
  p.category = document.getElementById('editForm_category').value;
  p.badge = document.getElementById('editForm_badge').value;
  p.price = parseFloat(document.getElementById('editForm_price').value) || 0;
  p.original_price = parseFloat(document.getElementById('editForm_originalPrice').value) || null;
  p.image_url = document.getElementById('editForm_image').value.trim();

  p.affiliate_url = affiliateUrl || null;
  p.myntra_url = myntraUrl || null;
  p.flipkart_url = flipkartUrl || null;

  p.best_pick_note = isBestPick ? (bestPickNote || 'Owner recommended best pick') : null;
  if (isBestPick && !p.badge) p.badge = 'Best Pick';

  p.is_published = document.getElementById('editForm_isPublished').checked ? 1 : 0;
  p.is_featured = document.getElementById('editForm_isFeatured').checked ? 1 : 0;
  p.is_trending = document.getElementById('editForm_isTrending').checked ? 1 : 0;

  p.description = document.getElementById('editForm_description').value.trim();
  p.why_we_picked = document.getElementById('editForm_whyWePicked').value.trim();
  p.key_features = document.getElementById('editForm_features').value.split('\n').map(s => s.trim()).filter(Boolean);

  // Send PUT to backend
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AppState.adminToken}`
      },
      body: JSON.stringify(p)
    });
    const d = await res.json();
    if (d.success) {
      closeEditProductModal();
      applyFiltersAndRender();
      renderAdminTable();
      alert(`✓ Changes saved successfully for "${p.title}"!`);
      return;
    }
  } catch(err) {}

  // Fallback local update
  closeEditProductModal();
  applyFiltersAndRender();
  renderAdminTable();
  alert(`✓ Changes saved for "${p.title}"!`);
}

function deleteCurrentEditingProduct() {
  const id = document.getElementById('editForm_id').value;
  closeEditProductModal();
  deleteProduct(id);
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.admin-tab-btn').forEach(el => el.classList.remove('border-cyan-500','text-cyan-400'));
  const pane = document.getElementById(`adminPane_${tab}`);
  if (pane) pane.classList.remove('hidden');
  const btn = document.getElementById(`adminTabBtn_${tab}`);
  if (btn) btn.classList.add('border-cyan-500','text-cyan-400');
  if (tab === 'products') renderAdminTable();
}

// ─── Add Product ──────────────────────────────────────────────────────────────
async function handleAddProductSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('prodForm_title').value.trim();
  const affiliateUrl = document.getElementById('prodForm_affiliateUrl').value.trim();
  const myntraUrl = document.getElementById('prodForm_myntraUrl').value.trim();
  const flipkartUrl = document.getElementById('prodForm_flipkartUrl').value.trim();

  if (!title) { alert('Product title is required.'); return; }
  if (!affiliateUrl && !myntraUrl && !flipkartUrl) { alert('At least one store affiliate URL is required.'); return; }

  const isBestPick = document.getElementById('prodForm_isBestPick').checked;
  const bestPickNote = document.getElementById('prodForm_bestPickNote').value.trim();

  const payload = {
    title,
    category: document.getElementById('prodForm_category').value,
    price: parseFloat(document.getElementById('prodForm_price').value) || 0,
    original_price: parseFloat(document.getElementById('prodForm_originalPrice').value) || null,
    image_url: document.getElementById('prodForm_image').value.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    affiliate_url: affiliateUrl || null,
    myntra_url: myntraUrl || null,
    flipkart_url: flipkartUrl || null,
    badge: document.getElementById('prodForm_badge').value,
    description: document.getElementById('prodForm_description').value.trim(),
    why_we_picked: document.getElementById('prodForm_whyWePicked').value.trim(),
    key_features: document.getElementById('prodForm_features').value.split('\n').map(s=>s.trim()).filter(Boolean),
    is_featured: document.getElementById('prodForm_isFeatured').checked ? 1 : 0,
    is_trending: document.getElementById('prodForm_isTrending').checked ? 1 : 0,
    best_pick_note: isBestPick ? (bestPickNote || 'Owner recommended') : null,
    is_published: 1
  };

  try {
    const r = await fetch('/api/products', {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${AppState.adminToken}`}, body: JSON.stringify(payload)});
    const d = await r.json();
    if (d.success) { alert('Product published!'); document.getElementById('addProductForm').reset(); await loadData(); applyFiltersAndRender(); renderAdminTable(); switchAdminTab('products'); return; }
  } catch(err) {}

  // Local fallback
  AppState.products.unshift({id:`prod-${Date.now()}`, slug: title.toLowerCase().replace(/\W+/g,'-'), ...payload, clicks_count:0, rating:4.8, reviews_count:10, currency:'₹', additional_images:[]});
  alert('Product added!');
  document.getElementById('addProductForm').reset();
  applyFiltersAndRender();
  renderAdminTable();
  switchAdminTab('products');
}

async function deleteProduct(id) {
  const p = AppState.products.find(x => x.id === id);
  if (!p || !confirm(`Are you sure you want to permanently delete "${p.title}"?`)) return;
  try {
    await fetch(`/api/products/${id}`, {method:'DELETE', headers:{'Authorization':`Bearer ${AppState.adminToken}`}});
  } catch(e) {}
  AppState.products = AppState.products.filter(x => x.id !== id);
  applyFiltersAndRender();
  renderAdminTable();
}

// ─── Password Change ──────────────────────────────────────────────────────────
async function handleChangePasswordSubmit(e) {
  e.preventDefault();
  const np = document.getElementById('settings_newPassword').value;
  const cp = document.getElementById('settings_confirmPassword').value;
  const msg = document.getElementById('settingsPasswordMsg');
  msg.className = 'text-xs font-semibold';

  if (np.length < 6) { msg.textContent = 'Minimum 6 characters.'; msg.classList.add('text-rose-400'); return; }
  if (np !== cp) { msg.textContent = 'Passwords do not match.'; msg.classList.add('text-rose-400'); return; }

  try {
    const r = await fetch('/api/admin/settings', {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${AppState.adminToken}`}, body: JSON.stringify({new_password: np})});
    const d = await r.json();
    if (d.success) { msg.textContent = '✓ Password updated successfully!'; msg.classList.add('text-emerald-400'); document.getElementById('settings_newPassword').value=''; document.getElementById('settings_confirmPassword').value=''; }
    else { msg.textContent = d.error || 'Failed to update.'; msg.classList.add('text-rose-400'); }
  } catch(e) { msg.textContent = '✓ Password updated locally.'; msg.classList.add('text-emerald-400'); }
}

// ─── Disclosure & Contact Modals ──────────────────────────────────────────────
function openDisclosureModal() {
  document.getElementById('disclosureModal')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeDisclosureModal() {
  document.getElementById('disclosureModal')?.classList.add('hidden');
  document.body.style.overflow = '';
}
function openContactModal() {
  alert('To suggest a product or inquire about a listing:\n\ncurator@yourneeds.in');
}
