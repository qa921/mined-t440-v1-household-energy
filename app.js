// Household energy transition — locale and market state handling (MINED-T440-V1)
const supportedLanguages = ['en', 'nl'];
const supportedMarkets = ['NL', 'BE', 'DE', 'DK'];
const defaultLang = 'en';
const defaultMarket = 'NL';

// Resolve the site base path from this script tag so both / and /explainer/ work.
const basePath = new URL(document.currentScript.src).pathname.replace(/app\.js$/, '');

function readState() {
  const params = new URLSearchParams(window.location.search);
  let lang = params.get('lang');
  let market = params.get('market');
  if (!supportedLanguages.includes(lang)) lang = defaultLang;
  if (!supportedMarkets.includes(market)) market = defaultMarket;
  return { lang, market };
}

function writeState(state) {
  // Defaults and valid values are written back consistently.
  const url = new URL(window.location.href);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('market', state.market);
  window.history.replaceState(null, '', url);
}

async function loadLocale(lang) {
  const res = await fetch(basePath + 'locales/' + lang + '.json');
  if (!res.ok) throw new Error('Missing locale: ' + lang);
  return res.json();
}

async function render(state) {
  const dict = await loadLocale(state.lang);
  document.documentElement.lang = state.lang;

  // Causal labels and UI copy never fall back to another language.
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  // Accessible diagram equivalent: names the three nodes in order.
  const visual = document.getElementById('visual');
  if (visual) {
    visual.setAttribute('aria-label', dict['visual.aria']);
    visual.textContent = dict['visual.text'];
  }

  const langSelect = document.getElementById('lang');
  if (langSelect) langSelect.value = state.lang;
  const marketSelect = document.getElementById('market');
  if (marketSelect) {
    Array.from(marketSelect.options).forEach((opt) => {
      opt.textContent = dict['marketLabel.' + opt.value] || opt.value;
    });
    marketSelect.value = state.market;
  }

  // Market context is supporting copy only (never a fourth causal node) and
  // may fall back to English when a localized market example is absent.
  let note = dict['market.' + state.market];
  if (!note) note = (await loadLocale('en'))['market.' + state.market];
  const marketNote = document.getElementById('market-note');
  if (marketNote) marketNote.textContent = note || '';

  // Route links between landing and explainer carry both values.
  document.querySelectorAll('a[data-nav]').forEach((link) => {
    const target = link.getAttribute('data-nav'); // '' = landing, 'explainer/' = how-it-works
    link.setAttribute('href', basePath + target + '?lang=' + state.lang + '&market=' + state.market);
  });
}

const state = readState();
writeState(state);
render(state);

const langSelect = document.getElementById('lang');
if (langSelect) {
  langSelect.addEventListener('change', function () {
    // Language change: the current valid market value is retained.
    state.lang = this.value;
    writeState(state);
    render(state);
  });
}
const marketSelect = document.getElementById('market');
if (marketSelect) {
  marketSelect.addEventListener('change', function () {
    // Market change: the language is retained; the causal relationship is unchanged.
    state.market = this.value;
    writeState(state);
    render(state);
  });
}
