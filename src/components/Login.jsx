// Login screen — the auth gate for the whole app (Phase 2).

import { useState } from 'react';
import { api } from '../lib/api.js';
import { Card, Btn, Field, Seg } from './ui.jsx';

export function Login({ t, lang, onLang, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api.login(username, password);
      onSuccess(data.user);
    } catch (err) {
      setError(err.status === 400 ? t('signInError') : err.message);
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <div className="card-b">
          <div className="login-brand">
            <img src="/assets/gsm-logo.png" alt="GSM logo" />
            <div>
              <div className="name" style={{ fontWeight: 600, fontSize: 16 }}>GSM · {t('appName')}</div>
              <div className="sub muted small">{t('signInSubtitle')}</div>
            </div>
          </div>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            <Field label={t('username')}>
              <input type="text" value={username} autoFocus autoComplete="username"
                onChange={(e) => setUsername(e.target.value)} />
            </Field>
            <Field label={t('password')}>
              <input type="password" value={password} autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error ? <div className="login-error">{error}</div> : null}
            <Btn kind="primary" disabled={busy || !username || !password}
              style={{ justifyContent: 'center' }}>
              {busy ? t('signingIn') : t('signIn')}
            </Btn>
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <Seg value={lang}
              options={[{ value: 'id', label: 'ID' }, { value: 'en', label: 'EN' }]}
              onChange={onLang} />
          </div>
        </div>
      </Card>
    </div>
  );
}
