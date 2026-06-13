// Step 2 · Build items

import { useState } from 'react';
import { fmtIDR } from '../lib/format.js';
import { PARTNERS, PRODUCTS, GLASS, FINISHES } from '../lib/data.js';
import { computeLine } from '../lib/pricing.js';
import { Card, Btn, Field, NumInput, SelectInput, PartnerBadge } from './ui.jsx';

export function Step2({ quote, update, t, lang }) {
  const partner = PARTNERS.find((p) => p.id === quote.partnerId);
  const [draft, setDraft] = useState({
    productId: 'sliding2', w: 2400, h: 2200, qty: 2, glassId: 'clear6', finishId: 'pcWhite'
  });
  const draftCalc = (draft.w > 0 && draft.h > 0 && draft.qty > 0)
    ? computeLine(draft, partner, lang) : null;

  function setD(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function addLine() {
    const line = { id: 'L' + Date.now(), ...draft };
    update(['lines'], quote.lines.concat([line]));
  }
  function removeLine(id) {
    update(['lines'], quote.lines.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '360px 1fr' }}>
        <Card title={t('configure')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label={t('productType')}>
              <SelectInput value={draft.productId}
                options={PRODUCTS.map((p) => ({ value: p.id, label: p.name[lang] }))}
                onChange={(v) => setD('productId', v)} />
            </Field>
            <div className="form-grid">
              <Field label={t('width')}>
                <NumInput value={draft.w} unit="mm" min={300} step={50} onChange={(v) => setD('w', v)} />
              </Field>
              <Field label={t('height')}>
                <NumInput value={draft.h} unit="mm" min={300} step={50} onChange={(v) => setD('h', v)} />
              </Field>
            </div>
            <Field label={t('glass')}>
              <SelectInput value={draft.glassId}
                options={GLASS.map((g) => ({ value: g.id, label: g.name[lang] }))}
                onChange={(v) => setD('glassId', v)} />
            </Field>
            <Field label={t('finish')}>
              <SelectInput value={draft.finishId}
                options={FINISHES.map((f) => ({ value: f.id, label: f.name[lang] }))}
                onChange={(v) => setD('finishId', v)} />
            </Field>
            <Field label={t('qty')}>
              <NumInput value={draft.qty} unit={t('units')} min={1} onChange={(v) => setD('qty', v)} />
            </Field>
            <Btn kind="primary" disabled={!draftCalc} onClick={addLine}>{t('addToQuote')}</Btn>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title={t('autoKit')} right={<PartnerBadge partner={partner} t={t} />}>
            {draftCalc ? (
              <div>
                {draftCalc.parts.map((p, i) => (
                  <div className="kit-row" key={i}>
                    <span className="k-name">
                      {p.name}
                      {p.auto ? <span className="badge" style={{ marginLeft: 8 }}>{t('auto')}</span> : null}
                    </span>
                    <span className="k-basis num">{p.basis}</span>
                    <span className="k-price num">{fmtIDR(p.price)}</span>
                  </div>
                ))}
                <div className="kit-row" style={{ borderTop: '2px solid var(--navy)', marginTop: 4, paddingTop: 9 }}>
                  <span className="k-name" style={{ fontWeight: 600 }}>{t('kitTotalUnit')}</span>
                  <span className="k-price num" style={{ fontSize: 15 }}>{fmtIDR(draftCalc.perUnit)}</span>
                </div>
                <p className="small muted" style={{ margin: '10px 2px 0' }}>{t('kitNote')}</p>
              </div>
            ) : <p className="muted">—</p>}
          </Card>

          <Card title={t('quoteLines')}>
            {quote.lines.length === 0
              ? <p className="muted small" style={{ margin: 0 }}>{t('emptyLines')}</p>
              : quote.lines.map((l) => {
                const c = computeLine(l, partner, lang);
                return <QuoteLine key={l.id} l={l} c={c} t={t} lang={lang} onRemove={removeLine} />;
              })}
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuoteLine({ l, c, t, lang, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="line-card">
      <div className="l-head" onClick={() => setOpen(!open)}>
        <span className="muted small">{open ? '▾' : '▸'}</span>
        <span className="l-title">{c.prod.name[lang]}</span>
        <span className="muted small num">{l.w} × {l.h} mm</span>
        <span className="badge">{l.qty} {t('units')}</span>
        <span className="num" style={{ fontWeight: 600 }}>{fmtIDR(c.total)}</span>
        <Btn sm onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}>{t('remove')}</Btn>
      </div>
      {open ? (
        <div className="l-body">
          {c.parts.map((p, i) => (
            <div className="kit-row" key={i}>
              <span className="k-name small">{p.name}{p.auto ? <span className="badge" style={{ marginLeft: 7 }}>{t('auto')}</span> : null}</span>
              <span className="k-basis num">{p.basis}</span>
              <span className="k-price num small">{fmtIDR(p.price)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
