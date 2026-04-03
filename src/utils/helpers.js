export const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

export const pct = (a, b) =>
  b > 0 ? Math.round(((a - b) / b) * 100) : 0;

export const marPrefix = '2026-03';

export const txByMonth = (txs, prefix) =>
  txs.filter((t) => t.date.startsWith(prefix));

export const sumType = (txs, type) =>
  txs.filter((t) => t.type === type).reduce((s, t) => s + t.amt, 0);

export const groupByCat = (txs) =>
  txs
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.cat] = (acc[t.cat] || 0) + t.amt;
      return acc;
    }, {});

export const MONTH_LABELS = {
  '2025-10': 'Oct', '2025-11': 'Nov', '2025-12': 'Dec',
  '2026-01': 'Jan', '2026-02': 'Feb', '2026-03': 'Mar',
};

export const SIX_MONTHS = [
  '2025-10','2025-11','2025-12','2026-01','2026-02','2026-03',
];

// Color palette for charts
export const PALETTE = [
  '#4ade80','#60a5fa','#fbbf24','#f472b6',
  '#a78bfa','#34d399','#fb923c','#38bdf8','#e879f9','#94a3b8',
];