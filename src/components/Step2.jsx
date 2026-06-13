// Step 2 · Build items — all pricing comes from the backend /compute/ endpoint.
// The draft (line being configured) is priced with its own debounced call; the
// committed lines are rendered from the quote-level `computed` result.

import { useEffect, useMemo, useState } from 'react';
import { fmtIDR } from '../lib/format.js';
import { api } from '../lib/api.js';
import { Card, Btn, Field, NumInput, SelectInput, PartnerBadge } from './ui.jsx';

export function Step2({ quote, update, t, lang, catalog, computed }) {
  const partner = catalog.partners.find((p) => p.code === quote.partner);
  const nameOf = (item) => (lang === 'id' ? item.name_id : item.name_en);

  const [draft, setDraft] = useState(() => ({
    product: catalog.products[0].code, width: 2400, height: 2200, qty: 2,
    glass: catalog.glass[0].code, finish: catalog.finishes[0].code,
  }));
  const [draftResult, setDraftResult] = useState(null);

  const draftValid = draft.width > 0 && draft.height > 0 && draft.qty > 0;
  const draftKey = useMemo(
    () => JSON.stringify({ partner: quote.partner, draft }),
    [quote.partner, draft],
  );

  // Debounced live pricing for the draft line.
  useEffect(() => {
    if (!draftValid) { setDraftResult(null); return; }
    let cancelled = false;
    const handle = setTimeout(() => {
      api.compute({ partner: quote.partner, margin_pct: 0, lang, lines: [draft] })
        .then((r) => { if (!cancelled) setDraftResult(r.lines[0]); })
        .catch(() => { if (!cancelled) setDraftResult(null); });
    }, 300);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [draftKey, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  function setD(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function addLine() {
    update(['lines'], quote.lines.concat([{ id: 'L' + Date.now(), ...draft }]));
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
              <SelectInput value={draft.product}
                options={catalog.products.map((p) => ({ value: p.code, label: nameOf(p) }))}
                onChange={(v) => setD('product', v)} />
            </Field>
            <div className="form-grid">
              <Field label={t('width')}>
                <NumInput value={draft.width} unit="mm" min={300} step={50} onChange={(v) => setD('width', v)} />
              </Field>
              <Field label={t('height')}>
                <NumInput value={draft.height} unit="mm" min={300} step={50} onChange={(v) => setD('height', v)} />
              </Field>
            </div>
            <Field label={t('glass')}>
              <SelectInput value={draft.glass}
                options={catalog.glass.map((g) => ({ value: g.code, label: nameOf(g) }))}
                onChange={(v) => setD('glass', v)} />
            </Field>
            <Field label={t('finish')}>
              <SelectInput value={draft.finish}
                options={catalog.finishes.map((f) => ({ value: f.code, label: nameOf(f) }))}
                onChange={(v) => setD('finish', v)} />
            </Field>
            <Field label={t('qty')}>
              <NumInput value={draft.qty} unit={t('units')} min={1} onChange={(v) => setD('qty', v)} />
            </Field>
            <Btn kind="primary" disabled={!draftValid} onClick={addLine}>{t('addToQuote')}</Btn>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title={t('autoKit')} right={<PartnerBadge partner={partner} t={t} />}>
            {draftResult ? (
              <div>
                {draftResult.parts.map((p, i) => (
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
                  <span className="k-price num" style={{ fontSize: 15 }}>{fmtIDR(draftResult.per_unit)}</span>
                </div>
                <p className="small muted" style={{ margin: '10px 2px 0' }}>{t('kitNote')}</p>
              </div>
            ) : <p className="muted">{draftValid ? t('computing') : '—'}</p>}
          </Card>

          <Card title={t('quoteLines')}>
            {quote.lines.length === 0
              ? <p className="muted small" style={{ margin: 0 }}>{t('emptyLines')}</p>
              : quote.lines.map((l, i) => (
                <QuoteLineCard key={l.id} line={l} computed={computed && computed.lines[i]}
                  fallbackName={nameOf(catalog.products.find((p) => p.code === l.product))}
                  t={t} onRemove={removeLine} />
              ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuoteLineCard({ line, computed, fallbackName, t, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="line-card">
      <div className="l-head" onClick={() => setOpen(!open)}>
        <span className="muted small">{open ? '▾' : '▸'}</span>
        <span className="l-title">{fallbackName}</span>
        <span className="muted small num">{line.width} × {line.height} mm</span>
        <span className="badge">{line.qty} {t('units')}</span>
        <span className="num" style={{ fontWeight: 600 }}>{computed ? fmtIDR(computed.total) : t('computing')}</span>
        <Btn sm onClick={(e) => { e.stopPropagation(); onRemove(line.id); }}>{t('remove')}</Btn>
      </div>
      {open && computed ? (
        <div className="l-body">
          {computed.parts.map((p, i) => (
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
