// Step 3 · Review pricing

import { fmtIDR } from '../lib/format.js';
import { I18N } from '../lib/i18n.js';
import { SERVICE_RATES } from '../lib/data.js';
import { computeQuote } from '../lib/pricing.js';
import { Card, Seg, Badge } from './ui.jsx';

export function Step3({ quote, update, t, lang }) {
  const q = computeQuote(quote, lang);
  const checks = I18N.checkItems[lang];
  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '1fr 340px' }}>
        <Card title={t('reviewTitle') + ' — ' + quote.client.name}>
          <table className="data">
            <thead>
              <tr><th>{t('line')}</th><th>{t('basis')}</th><th className="num">{t('qty')}</th><th className="num">{t('total')}</th></tr>
            </thead>
            <tbody>
              {q.lines.map((l) => (
                <tr key={l.line.id}>
                  <td>{l.prod.name[lang]}<div className="small muted num">{l.line.w} × {l.line.h} mm</div></td>
                  <td className="small muted">{q.partner.name} · {q.partner.basis === 'kg' ? t('perKg') : t('perUnit')}</td>
                  <td className="num">{l.line.qty}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{fmtIDR(l.total)}</td>
                </tr>
              ))}
              <tr>
                <td>{t('assembly')}</td>
                <td className="small muted num">{q.totalQty} × {fmtIDR(SERVICE_RATES.assemblyPerOpening)}</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(q.assembly)}</td>
              </tr>
              <tr>
                <td>{t('logistics')}</td>
                <td className="small muted">flat</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(q.logistics)}</td>
              </tr>
              <tr>
                <td>{t('installation')}</td>
                <td className="small muted num">{q.installDays} × {fmtIDR(SERVICE_RATES.installPerDay)}</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(q.installation)}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title={t('breakdown')}>
            <table className="data">
              <tbody>
                <tr><td>{t('materials')}</td><td className="num">{fmtIDR(q.materials)}</td></tr>
                <tr><td>{t('smallParts')}</td><td className="num">{fmtIDR(q.smallParts)}</td></tr>
                <tr><td>{t('assembly')}</td><td className="num">{fmtIDR(q.assembly)}</td></tr>
                <tr><td>{t('logistics')}</td><td className="num">{fmtIDR(q.logistics)}</td></tr>
                <tr><td>{t('installation')}</td><td className="num">{fmtIDR(q.installation)}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>{t('costSubtotal')}</td><td className="num" style={{ fontWeight: 600 }}>{fmtIDR(q.costSubtotal)}</td></tr>
                <tr>
                  <td>{t('margin')}</td>
                  <td className="num">
                    <Seg value={quote.marginPct}
                      options={[15, 18, 22].map((m) => ({ value: m, label: m + '%' }))}
                      onChange={(v) => update(['marginPct'], v)} />
                  </td>
                </tr>
                <tr className="total"><td>{t('quoteTotal')}</td><td className="num">{fmtIDR(q.grandTotal)}</td></tr>
              </tbody>
            </table>
            <p className="small muted" style={{ margin: '10px 2px 0' }}>{t('marginNote')}</p>
          </Card>

          <Card title={t('completeness')} right={<Badge kind="ok">{checks.length} / {checks.length}</Badge>}>
            {checks.map((c, i) => (
              <div className="check-row" key={i}><span className="ck">✓</span>{c}</div>
            ))}
            <p className="small muted" style={{ margin: '8px 2px 0' }}>{t('completenessOk')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
