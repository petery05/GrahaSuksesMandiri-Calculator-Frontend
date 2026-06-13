// Step 1 · Client & partner — partners come from the backend catalog.

import { I18N } from '../lib/i18n.js';
import { Card, Field, TextInput, SelectInput, Badge, PartnerMark } from './ui.jsx';

export function Step1({ quote, update, t, lang, catalog }) {
  const types = I18N.projectTypes[lang];
  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '360px 1fr' }}>
        <Card title={t('client')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label={t('clientName')}>
              <TextInput value={quote.client.name} onChange={(v) => update(['client', 'name'], v)} />
            </Field>
            <Field label={t('contact')}>
              <TextInput value={quote.client.contact} onChange={(v) => update(['client', 'contact'], v)} />
            </Field>
            <Field label={t('site')}>
              <TextInput value={quote.client.site} onChange={(v) => update(['client', 'site'], v)} />
            </Field>
            <Field label={t('projectType')}>
              <SelectInput value={quote.client.type}
                options={types.map((x, i) => ({ value: String(i), label: x }))}
                onChange={(v) => update(['client', 'type'], v)} />
            </Field>
          </div>
        </Card>
        <div>
          <Card title={t('choosePartner')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {catalog.partners.map((p) => (
                <button key={p.code} className={'partner-card' + (quote.partner === p.code ? ' selected' : '')}
                  onClick={() => update(['partner'], p.code)}>
                  <PartnerMark partner={p} />
                  <span style={{ flex: 1 }}>
                    <span className="p-name">{p.name}</span>
                    <span className="badge" style={{ marginLeft: 8 }}>{p.basis === 'kg' ? t('perKg') : t('perUnit')}</span>
                    <div className="p-meta">{t('priceList')} {p.price_list_version} · {t('updated')} {p.price_list_updated}</div>
                  </span>
                  {p.is_current
                    ? <Badge kind="ok">✓ {t('current')}</Badge>
                    : <Badge kind="warn">! {t('stale')}</Badge>}
                </button>
              ))}
            </div>
            <p className="small muted" style={{ margin: '12px 2px 0' }}>{t('freshNote')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
