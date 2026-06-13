// Step 4 · Generate tender — template picker + live document preview + export.
// Export buttons show a toast for now; real PDF/Excel generation arrives in
// Phase 4 via the Django API.

import { fmtIDR } from '../lib/format.js';
import { I18N, makeT } from '../lib/i18n.js';
import { computeQuote } from '../lib/pricing.js';
import { Card, Btn } from './ui.jsx';

const TPL_META = [
  { id: 'xlsx', icon: 'XLS', color: '#1f8a5b' },
  { id: 'pdf', icon: 'PDF', color: '#b3261e' },
  { id: 'pdf2', icon: 'PDF', color: '#327EBC' }
];

function DocPreview({ quote, q, lang, tpl }) {
  const bilingual = tpl === 'pdf2';
  const excel = tpl === 'xlsx';
  const lbl = (key) => {
    if (!bilingual) return makeT(lang)(key);
    return I18N[key].id + ' / ' + I18N[key].en;
  };
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (
    <div className={'doc-preview' + (excel ? ' excel' : '')}>
      <div className="doc-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/assets/gsm-logo.png" alt="GSM" style={{ height: 26 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 11 }}>PT Graha Sukses Mandiri</div>
            <div className="muted" style={{ fontSize: 9 }}>Custom aluminum · supply & install</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{lbl('tender')} #Q-1042</div>
          <div className="muted" style={{ fontSize: 9 }}>{lbl('date')}: {today}</div>
        </div>
      </div>
      <div className="doc-rule"></div>
      <div style={{ fontSize: 10 }}>
        <b>{quote.client.name}</b> · {quote.client.contact}<br />
        {quote.client.site}
      </div>
      <table>
        <thead>
          <tr><th>{lbl('line')}</th><th className="num">{lbl('qty')}</th><th className="num">{lbl('total')}</th></tr>
        </thead>
        <tbody>
          {q.lines.map((l) => (
            <tr key={l.line.id}>
              <td>{bilingual ? l.prod.name.id + ' / ' + l.prod.name.en : l.prod.name[lang]}
                <span className="muted"> · {l.line.w}×{l.line.h}</span></td>
              <td className="num">{l.line.qty}</td>
              <td className="num">{fmtIDR(l.total)}</td>
            </tr>
          ))}
          <tr><td>{lbl('assembly')}</td><td className="num">—</td><td className="num">{fmtIDR(q.assembly)}</td></tr>
          <tr><td>{lbl('logistics')}</td><td className="num">—</td><td className="num">{fmtIDR(q.logistics)}</td></tr>
          <tr><td>{lbl('installation')}</td><td className="num">—</td><td className="num">{fmtIDR(q.installation)}</td></tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, fontSize: 10 }}>
        <span className="muted">{lbl('margin')} {quote.marginPct}%</span>
        <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--navy)' }}>{lbl('quoteTotal')}: {fmtIDR(q.grandTotal)}</span>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div className="doc-rule" style={{ borderTopWidth: 1 }}></div>
        <div className="muted" style={{ fontSize: 8.5, marginTop: 5 }}>{lbl('validity')}</div>
      </div>
    </div>
  );
}

export function Step4({ quote, update, t, lang, toast }) {
  const q = computeQuote(quote, lang);
  const tpls = I18N.templates[lang];
  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '320px 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title={t('pickTemplate')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {tpls.map((tp, i) => {
                const meta = TPL_META[i];
                return (
                  <button key={meta.id}
                    className={'tpl-card' + (quote.templateId === meta.id ? ' selected' : '')}
                    onClick={() => update(['templateId'], meta.id)}>
                    <span className="tpl-icon" style={{ background: meta.color }}>{meta.icon}</span>
                    <span>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tp.t}</div>
                      <div className="small muted">{tp.s}</div>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card title={t('exportT')}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn kind="primary" onClick={() => toast(t('generated'))}>⬇ {t('downloadXlsx')}</Btn>
              <Btn kind="ghost" onClick={() => toast(t('generated'))}>⬇ {t('downloadPdf')}</Btn>
            </div>
          </Card>
        </div>
        <Card title={t('preview')}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <DocPreview quote={quote} q={q} lang={lang} tpl={quote.templateId} />
            <span className="small muted">{t('page')} · ‹ ›</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
