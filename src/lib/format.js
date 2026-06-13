// Number formatting helpers (Indonesian locale).

export const fmtIDR = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

export const fmtKg = (n) => n.toFixed(1).replace('.', ',') + ' kg';
