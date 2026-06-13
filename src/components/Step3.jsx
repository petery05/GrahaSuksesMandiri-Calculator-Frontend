// Step 3 · Review pricing — fully driven by the backend /compute/ result.

import { fmtIDR } from '../lib/format.js';
import { I18N } from '../lib/i18n.js';
import { Card, Seg, Badge } from './ui.jsx';

export function Step3({ quote, update, t, lang, computed }) {
  const checks = I18N.checkItems[lang];
  if (!computed) {
    return <p className="muted" style={{ padding: 20 }}>{t('computing')}</p>;
  }
  const rates = computed.rates;
  const prodName = (l) => (lang === 'id' ? l.product_name_id : l.product_name_en);
  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '1fr 340px' }}>
        <Card title={t('reviewTitle') + ' — ' + quote.client.name}>
          <table className="data">
            <thead>
              <tr><th>{t('line')}</th><th>{t('basis')}</th><th className="num">{t('qty')}</th><th className="num">{t('total')}</th></tr>
            </thead>
            <tbody>
              {computed.lines.map((l, i) => (
                <tr key={i}>
                  <td>{prodName(l)}<div className="small muted num">{l.width} × {l.height} mm</div></td>
                  <td className="small muted">{computed.partner.name} · {computed.partner.basis === 'kg' ? t('perKg') : t('perUnit')}</td>
                  <td className="num">{l.qty}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{fmtIDR(l.total)}</td>
                </tr>
              ))}
              <tr>
                <td>{t('assembly')}</td>
                <td className="small muted num">{computed.total_qty} × {fmtIDR(rates.assembly_per_opening)}</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(computed.assembly)}</td>
              </tr>
              <tr>
                <td>{t('logistics')}</td>
                <td className="small muted">flat</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(computed.logistics)}</td>
              </tr>
              <tr>
                <td>{t('installation')}</td>
                <td className="small muted num">{computed.install_days} × {fmtIDR(rates.install_per_day)}</td>
                <td className="num">—</td>
                <td className="num">{fmtIDR(computed.installation)}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title={t('breakdown')}>
            <table className="data">
              <tbody>
                <tr><td>{t('materials')}</td><td className="num">{fmtIDR(computed.materials)}</td></tr>
                <tr><td>{t('smallParts')}</td><td className="num">{fmtIDR(computed.small_parts)}</td></tr>
                <tr><td>{t('assembly')}</td><td className="num">{fmtIDR(computed.assembly)}</td></tr>
                <tr><td>{t('logistics')}</td><td className="num">{fmtIDR(computed.logistics)}</td></tr>
                <tr><td>{t('installation')}</td><td className="num">{fmtIDR(computed.installation)}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>{t('costSubtotal')}</td><td className="num" style={{ fontWeight: 600 }}>{fmtIDR(computed.cost_subtotal)}</td></tr>
                <tr>
                  <td>{t('margin')}</td>
                  <td className="num">
                    <Seg value={quote.marginPct}
                      options={[15, 18, 22].map((m) => ({ value: m, label: m + '%' }))}
                      onChange={(v) => update(['marginPct'], v)} />
                  </td>
                </tr>
                <tr className="total"><td>{t('quoteTotal')}</td><td className="num">{fmtIDR(computed.grand_total)}</td></tr>
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
