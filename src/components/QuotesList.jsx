// My quotes — list of the signed-in user's saved quotes, with reopen / duplicate
// / delete. Each row is a full quote snapshot from the backend.

import { useEffect, useState } from 'react';
import { fmtIDR } from '../lib/format.js';
import { api } from '../lib/api.js';
import { Card, Btn, Badge } from './ui.jsx';

export function QuotesList({ t, onOpen, onDuplicate }) {
  const [quotes, setQuotes] = useState(null);
  const [error, setError] = useState(false);

  function refresh() {
    setError(false);
    api.listQuotes().then(setQuotes).catch(() => setError(true));
  }
  useEffect(refresh, []);

  async function remove(id) {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await api.deleteQuote(id);
      refresh();
    } catch {
      setError(true);
    }
  }

  return (
    <Card title={t('myQuotes')}>
      {error ? <p className="login-error">{t('loadError')}</p> : null}
      {quotes === null && !error ? <p className="muted">{t('loading')}</p> : null}
      {quotes && quotes.length === 0 ? <p className="muted small">{t('noQuotes')}</p> : null}
      {quotes && quotes.length > 0 ? (
        <table className="data">
          <thead>
            <tr>
              <th>{t('quoteTotal')}</th>
              <th>{t('client')}</th>
              <th>{t('priceList')}</th>
              <th>{t('validUntil')}</th>
              <th className="num">{t('total')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <td>
                  <span style={{ fontWeight: 600 }}>{q.reference}</span>
                  <div className="small muted">{q.partner_name} · {q.created_at.slice(0, 10)}</div>
                </td>
                <td>{q.client_name}</td>
                <td><Badge>{q.price_list_version}</Badge></td>
                <td className="small muted num">{q.valid_until}</td>
                <td className="num" style={{ fontWeight: 600 }}>{fmtIDR(Number(q.grand_total))}</td>
                <td className="num" style={{ whiteSpace: 'nowrap' }}>
                  <Btn sm onClick={() => onOpen(q)}>{t('open')}</Btn>{' '}
                  <Btn sm onClick={() => onDuplicate(q)}>{t('duplicate')}</Btn>{' '}
                  <Btn sm onClick={() => remove(q.id)}>{t('remove')}</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Card>
  );
}
