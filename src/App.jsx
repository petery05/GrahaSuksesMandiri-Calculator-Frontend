// App shell: auth gate, catalog load, wizard state, server-side pricing, and
// the Builder / My-quotes views. The backend is the source of truth for pricing
// (debounced /compute/ calls) and for saved quotes.

import { useEffect, useMemo, useRef, useState } from 'react';
import { fmtIDR } from './lib/format.js';
import { I18N, makeT } from './lib/i18n.js';
import { api } from './lib/api.js';
import { Btn, Seg, Stepper } from './components/ui.jsx';
import { Login } from './components/Login.jsx';
import { Step1 } from './components/Step1.jsx';
import { Step2 } from './components/Step2.jsx';
import { Step3 } from './components/Step3.jsx';
import { Step4 } from './components/Step4.jsx';
import { QuotesList } from './components/QuotesList.jsx';

const STORE_KEY = 'gsm-cpq-v2';   // v2: line shape aligned to the API (product/width/height/glass/finish)
const LANG_KEY = 'gsm-cpq-lang';

const DEFAULT_QUOTE = {
  client: { name: '', contact: '', site: '', type: '0' },
  partner: 'starmas',
  lines: [],
  marginPct: 18,
  templateId: 'pdf',
};

// In-progress wizard draft is cached in localStorage so a refresh doesn't lose
// it; saved quotes live in the backend.
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.quote && Array.isArray(s.quote.lines)) return s;
    }
  } catch {
    // corrupted draft — fall through to defaults
  }
  return { step: 0, maxStep: 0, quote: DEFAULT_QUOTE };
}

function toComputePayload(quote, lang) {
  return {
    partner: quote.partner,
    margin_pct: quote.marginPct,
    lang,
    lines: quote.lines.map(({ id, ...rest }) => rest), // eslint-disable-line no-unused-vars
  };
}

function quoteFromSaved(saved) {
  return {
    client: {
      name: saved.client_name, contact: saved.client_contact,
      site: saved.client_site, type: saved.project_type,
    },
    partner: saved.partner,
    lines: saved.lines.map((l) => ({
      id: 'L' + l.id, product: l.product, width: l.width, height: l.height,
      qty: l.qty, glass: l.glass, finish: l.finish,
    })),
    marginPct: Number(saved.margin_pct),
    templateId: saved.template_id,
  };
}

export default function App() {
  const init = useMemo(loadState, []);
  const [step, setStep] = useState(init.step);
  const [maxStep, setMaxStep] = useState(init.maxStep);
  const [quote, setQuote] = useState(init.quote);
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'id');
  const [view, setView] = useState('builder');
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [catalog, setCatalog] = useState(null);
  const [computed, setComputed] = useState(null);
  const [saving, setSaving] = useState(false);

  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    api.me()
      .then((d) => setAuthUser(d.authenticated ? d.user : null))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Load the catalog once authenticated.
  useEffect(() => {
    if (!authUser) return;
    api.catalog().then(setCatalog).catch(() => setCatalog(null));
  }, [authUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ step, maxStep, quote }));
    } catch { /* best-effort */ }
  }, [step, maxStep, quote]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Debounced server-side pricing — recomputes only when pricing inputs change
  // (partner / lines / margin / language), not on client-detail edits.
  const computeKey = useMemo(() => JSON.stringify(toComputePayload(quote, lang)), [quote, lang]);
  useEffect(() => {
    if (!authUser) return undefined;
    const payload = JSON.parse(computeKey);
    if (payload.lines.length === 0) { setComputed(null); return undefined; }
    let cancelled = false;
    const handle = setTimeout(() => {
      api.compute(payload)
        .then((res) => { if (!cancelled) setComputed(res); })
        .catch(() => { if (!cancelled) setComputed(null); });
    }, 300);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [authUser, computeKey]);

  function update(path, value) {
    setQuote((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  function go(n) {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    window.scrollTo(0, 0);
  }

  function toast(msg) {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }

  function resetAll() {
    setQuote(DEFAULT_QUOTE);
    setStep(0);
    setMaxStep(0);
    setView('builder');
  }

  function loadSaved(saved, { duplicate } = {}) {
    setQuote(quoteFromSaved(saved));
    setMaxStep(3);
    setStep(duplicate ? 0 : 2);
    setView('builder');
    if (duplicate) toast(t('duplicate'));
  }

  async function saveQuote() {
    setSaving(true);
    try {
      const saved = await api.createQuote({
        ...toComputePayload(quote, lang),
        client_name: quote.client.name,
        client_contact: quote.client.contact,
        client_site: quote.client.site,
        project_type: quote.client.type,
        template_id: quote.templateId,
      });
      toast(t('savedAs') + ' ' + saved.reference);
    } catch {
      toast(t('saveError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try { await api.logout(); } catch { /* clear locally regardless */ }
    setAuthUser(null);
    setCatalog(null);
  }

  if (authLoading) {
    return <div className="login-wrap"><span className="muted">GSM · {t('appName')}…</span></div>;
  }
  if (!authUser) {
    return <Login t={t} lang={lang} onLang={setLang} onSuccess={setAuthUser} />;
  }

  const canContinue =
    step === 0 ? (quote.client.name.trim() !== '' && !!quote.partner) :
    step === 1 ? quote.lines.length > 0 : true;
  const steps = I18N.steps[lang];
  const runningTotal = computed ? (step >= 2 ? computed.grand_total : computed.cost_subtotal) : null;

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <img src="/assets/gsm-logo.png" alt="GSM logo" />
          <div>
            <div className="name">GSM · {t('appName')}</div>
            <div className="sub">{t('company')}</div>
          </div>
        </div>
        <div className="spacer"></div>
        <Seg value={view}
          options={[{ value: 'builder', label: t('builder') }, { value: 'quotes', label: t('myQuotes') }]}
          onChange={setView} />
        <Seg value={lang}
          options={[{ value: 'id', label: 'ID' }, { value: 'en', label: 'EN' }]}
          onChange={setLang} />
        <Btn sm onClick={resetAll}>{t('reset')}</Btn>
        <div className="user">
          <span className="avatar">{authUser.username.slice(0, 2).toUpperCase()}</span>
          <Btn sm onClick={handleLogout}>{t('signOut')}</Btn>
        </div>
      </header>

      <main className="shell">
        {view === 'quotes' ? (
          <QuotesList t={t} lang={lang}
            onOpen={(q) => loadSaved(q)}
            onDuplicate={(q) => loadSaved(q, { duplicate: true })} />
        ) : !catalog ? (
          <p className="muted" style={{ padding: 20 }}>{t('loading')}</p>
        ) : (
          <>
            <Stepper steps={steps} active={step} maxStep={maxStep} onGo={go} />
            {step === 0 ? <Step1 quote={quote} update={update} t={t} lang={lang} catalog={catalog} /> : null}
            {step === 1 ? <Step2 quote={quote} update={update} t={t} lang={lang} catalog={catalog} computed={computed} /> : null}
            {step === 2 ? <Step3 quote={quote} update={update} t={t} lang={lang} computed={computed} /> : null}
            {step === 3 ? <Step4 quote={quote} update={update} t={t} lang={lang} computed={computed} toast={toast} onSave={saveQuote} saving={saving} /> : null}
          </>
        )}
      </main>

      {view === 'builder' && catalog ? (
        <footer className="wizard-footer">
          {step > 0 ? <Btn onClick={() => go(step - 1)}>← {t('back')}</Btn> : <span></span>}
          {step < 3 ? (
            <Btn kind="primary" disabled={!canContinue} onClick={() => go(step + 1)}>
              {t('continueTo')} → {steps[step + 1]}
            </Btn>
          ) : null}
          {quote.lines.length > 0 && runningTotal !== null ? (
            <div className="running">
              <span className="lbl">{step >= 2 ? t('quoteTotal') : t('runningTotal')}</span>
              <span className="val num">{fmtIDR(runningTotal)}</span>
            </div>
          ) : null}
        </footer>
      ) : null}

      {toastMsg ? <div className="toast">{toastMsg}</div> : null}
    </div>
  );
}
