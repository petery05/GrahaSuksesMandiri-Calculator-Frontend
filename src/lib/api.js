// Thin API client for the Django backend.
// Requests go through Vite's /api proxy, so they're same-origin and the session
// cookie flows automatically. Django sets a csrftoken cookie (via the /auth/me/
// endpoint, which is decorated with ensure_csrf_cookie); we echo it back in the
// X-CSRFToken header on unsafe requests.

function getCookie(name) {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return match ? match.pop() : '';
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET' && method !== 'HEAD') headers['X-CSRFToken'] = getCookie('csrftoken');

  const res = await fetch('/api' + path, {
    method,
    headers,
    credentials: 'same-origin',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((data && data.detail) || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  me: () => request('/auth/me/'),
  login: (username, password) => request('/auth/login/', { method: 'POST', body: { username, password } }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  catalog: () => request('/catalog/'),
  compute: (payload) => request('/compute/', { method: 'POST', body: payload }),
  // Quote persistence (list / create / retrieve / delete) is wired up in Phase 3.
  listQuotes: () => request('/quotes/'),
  createQuote: (payload) => request('/quotes/', { method: 'POST', body: payload }),
};
