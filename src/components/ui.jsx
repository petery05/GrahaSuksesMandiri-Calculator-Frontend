// Shared UI components for the GSM quote builder.

import { Fragment } from 'react';

export function Card({ title, right, children, style }) {
  return (
    <div className="card" style={style}>
      {title ? (
        <div className="card-h">
          <h3>{title}</h3>
          {right || null}
        </div>
      ) : null}
      <div className="card-b">{children}</div>
    </div>
  );
}

export function Btn({ kind = 'ghost', sm, disabled, onClick, children, style }) {
  return (
    <button className={'btn ' + kind + (sm ? ' sm' : '')} disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

export function Seg({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? 'on' : ''}
          onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Badge({ kind = '', children }) {
  return <span className={'badge ' + kind}>{children}</span>;
}

export function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder }) {
  return <input type="text" value={value} placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)} />;
}

export function NumInput({ value, onChange, unit, min = 1, step = 1 }) {
  return (
    <div className="unit-wrap">
      <input type="number" className="num" value={value} min={min} step={step}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
      {unit ? <span className="unit">{unit}</span> : null}
    </div>
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Stepper({ steps, active, maxStep, onGo }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const cls = i === active ? 'active' : i < active ? 'done' : '';
        const clickable = i <= maxStep && i !== active;
        return (
          <Fragment key={i}>
            {i > 0 ? <div className={'step-line' + (i <= active ? ' done' : '')}></div> : null}
            <button className={'step-item ' + cls + (clickable ? ' clickable' : '')}
              onClick={() => { if (clickable) onGo(i); }}>
              <span className="dot">{i < active ? '✓' : i + 1}</span>
              <span>{s}</span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

export function PartnerMark({ partner, size = 42 }) {
  return (
    <span className="partner-mark" style={{
      width: size, height: size, fontSize: size * 0.36,
      background: 'linear-gradient(135deg, ' + partner.c1 + ' 0%, ' + partner.c1 + ' 55%, ' + partner.c2 + ' 55%, ' + partner.c2 + ' 100%)'
    }}>
      {partner.name.charAt(0)}
    </span>
  );
}

export function PartnerBadge({ partner, t }) {
  return (
    <span className="badge blue" style={{ gap: 7 }}>
      <span className="dot-sw" style={{ background: partner.c1 }}></span>
      {partner.name} · {partner.basis === 'kg' ? t('perKg') : t('perUnit')} · {t('priceList')} {partner.listVersion} ✓
    </span>
  );
}
