import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  fmt, marPrefix, txByMonth, sumType, groupByCat,
  MONTH_LABELS, SIX_MONTHS, PALETTE,
} from '../utils/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyChart({ txs }) {
  const labels = SIX_MONTHS.map((m) => MONTH_LABELS[m]);
  const incomes = SIX_MONTHS.map((m) => sumType(txByMonth(txs, m), 'income'));
  const expenses = SIX_MONTHS.map((m) => sumType(txByMonth(txs, m), 'expense'));

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomes.map(Math.round),
        backgroundColor: 'rgba(74,222,128,0.75)',
        borderRadius: 3,
      },
      {
        label: 'Expenses',
        data: expenses.map(Math.round),
        backgroundColor: 'rgba(248,113,113,0.65)',
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#5a5852',
          font: { size: 11, family: 'JetBrains Mono' },
          usePointStyle: true,
          pointStyleWidth: 8,
          boxHeight: 6,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${fmt(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5a5852', font: { size: 11, family: 'JetBrains Mono' } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#5a5852',
          font: { size: 10, family: 'JetBrains Mono' },
          callback: (value) => '₹' + Math.round(value / 1000) + 'k',
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <div className="box-head">
        <div className="box-title">Monthly comparison</div>
        <div className="box-sub">Income vs expenses — 6 months</div>
      </div>
      <div className="chart-wrap" style={{ height: 210 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions: txs } = state;

  const curExp = txByMonth(txs, marPrefix).filter((t) => t.type === 'expense');
  const catMap = groupByCat(txByMonth(txs, marPrefix));
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const top = catEntries[0];

  const incomeByMonth = SIX_MONTHS.map((m) => sumType(txByMonth(txs, m), 'income'));
  const maxIncIdx = incomeByMonth.indexOf(Math.max(...incomeByMonth));
  const bestM = MONTH_LABELS[SIX_MONTHS[maxIncIdx]];
  const bestY = SIX_MONTHS[maxIncIdx].slice(0, 4);

  const avgDay = curExp.reduce((sum, t) => sum + t.amt, 0) / 31;

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h1 className="page-title">Insights</h1>
          <div className="page-sub">What the numbers say</div>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span className="insight-icon">↑</span>
          <div className="insight-label">Top category</div>
          <div className="insight-value">{top ? top[0] : '—'}</div>
          <div className="insight-desc">
            {top ? `${fmt(top[1])} spent this month` : 'No expense data'}
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">◈</span>
          <div className="insight-label">Best income month</div>
          <div className="insight-value">{bestM} {bestY}</div>
          <div className="insight-desc">
            {fmt(incomeByMonth[maxIncIdx])} earned
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">∿</span>
          <div className="insight-label">Daily avg spend</div>
          <div className="insight-value">{fmt(avgDay)}</div>
          <div className="insight-desc">Per day in March 2026</div>
        </div>
      </div>

      <MonthlyChart txs={txs} />

      <div className="chart-box">
        <div className="box-head">
          <div className="box-title">Where it goes</div>
          <div className="box-sub">Expense breakdown by category</div>
        </div>
        {catEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">∅</div>
            No expense data
          </div>
        ) : (
          <div className="bar-list">
            {catEntries.slice(0, 8).map(([cat, val], i) => (
              <div key={cat} className="bar-row">
                <div className="bar-label">{cat}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: Math.round((val / catEntries[0][1]) * 100) + '%',
                      background: PALETTE[i % PALETTE.length],
                    }}
                  />
                </div>
                <div className="bar-amount">{fmt(val)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}