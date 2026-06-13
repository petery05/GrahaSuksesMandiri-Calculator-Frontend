// App shell: header, stepper, wizard state, persistence.

import { useEffect, useMemo, useRef, useState } from 'react';
import { fmtIDR } from './lib/format.js';
import { I18N, makeT } from './lib/i18n.js';
import { computeQuote } from './lib/pricing.js';
import { api } from './lib/api.js';
import { Btn, Seg, Stepper } from './components/ui.jsx';
import { Login } from './components/Login.jsx';
import { Step1 } from './components/Step1.jsx';
import { Step2 } from './components/Step2.jsx';
import { Step3 } from './components/Step3.jsx';
import { Step4 } from './components/Step4.jsx';

const STORE_KEY = 'gsm-cpq-v1';
const LANG_KEY = 'gsm-cpq-lang';

const DEFAULT_QUOTE = {
  client: { name: '', contact: '', site: '', type: '0' },
  partnerId: 'starmas',
  lines: [],
  marginPct: 18,
  templateId: 'pdf'
};

// Phase 1: state persists in localStorage; Phase 3 moves quotes to the API.
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.quote && Array.isArray(s.quote.lines)) return s;
    }
  } catch {
    // corrupted state — fall through to defaults
  }
  return { step: 0, maxStep: 0, quote: DEFAULT_QUOTE };
}

export default function App() {
  const init = useMemo(loadState, []);
  const [step, setStep] = useState(init.step);
  const [maxStep, setMaxStep] = useState(init.maxStep);
  const [quote, setQuote] = useState(init.quote);
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'id');
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    api.me()
      .then((d) => setAuthUser(d.authenticated ? d.user : null))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ step, maxStep, quote }));
    } catch {
      // storage full / unavailable — persistence is best-effort in Phase 1
    }
  }, [step, maxStep, quote]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

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
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }

  function resetAll() {
    setQuote(DEFAULT_QUOTE);
    setStep(0);
    setMaxStep(0);
  }

  async function handleLogout() {
    try { await api.logout(); } catch { /* ignore — clear locally regardless */ }
    setAuthUser(null);
  }

  if (authLoading) {
    return <div className="login-wrap"><span className="muted">GSM · {t('appName')}…</span></div>;
  }
  if (!authUser) {
    return <Login t={t} lang={lang} onLang={setLang} onSuccess={setAuthUser} />;
  }

  const q = computeQuote(quote, lang);
  const canContinue =
    step === 0 ? (quote.client.name.trim() !== '' && !!quote.partnerId) :
    step === 1 ? quote.lines.length > 0 : true;

  const steps = I18N.steps[lang];

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
        <Stepper steps={steps} active={step} maxStep={maxStep} onGo={go} />
        {step === 0 ? <Step1 quote={quote} update={update} t={t} lang={lang} /> : null}
        {step === 1 ? <Step2 quote={quote} update={update} t={t} lang={lang} /> : null}
        {step === 2 ? <Step3 quote={quote} update={update} t={t} lang={lang} /> : null}
        {step === 3 ? <Step4 quote={quote} update={update} t={t} lang={lang} toast={toast} /> : null}
      </main>

      <footer className="wizard-footer">
        {step > 0 ? <Btn onClick={() => go(step - 1)}>← {t('back')}</Btn> : <span></span>}
        {step < 3 ? (
          <Btn kind="primary" disabled={!canContinue} onClick={() => go(step + 1)}>
            {t('continueTo')} → {steps[step + 1]}
          </Btn>
        ) : null}
        {quote.lines.length > 0 ? (
          <div className="running">
            <span className="lbl">{step >= 2 ? t('quoteTotal') : t('runningTotal')}</span>
            <span className="val num">{fmtIDR(step >= 2 ? q.grandTotal : q.costSubtotal)}</span>
          </div>
        ) : null}
      </footer>

      {toastMsg ? <div className="toast">{toastMsg}</div> : null}
    </div>
  );
}
