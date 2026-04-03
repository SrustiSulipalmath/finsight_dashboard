import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  fmt, pct, marPrefix, txByMonth, sumType, groupByCat, PALETTE,
} from '../utils/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

function StatCard({ label, value, delta, valueClass = '' }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${valueClass}`}>{value}</div>
      {delta && <div className="stat-delta">{delta}</div>}
    </div>
  );
}

function TrendChart({ txs }) {
  // Calculate 30-day running balance
  const days = [];
  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date('2026-03-31');
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
    labels.push(d.getDate() + '');
  }
  
  let runningBalance = txs
    .filter((t) => t.date < days[0])
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amt : -t.amt), 0);
  
  const balanceData = days.map((day) => {
    txs.filter((t) => t.date === day).forEach((t) => {
      runningBalance += t.type === 'income' ? t.amt : -t.amt;
    });
    return Math.round(runningBalance);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        data: balanceData,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74,222,128,0.06)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Balance: ${fmt(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5a5852', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 8 },
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
        <div className="box-title">Balance trend</div>
        <div className="box-sub">Rolling 30-day balance</div>
      </div>
      <div className="chart-wrap" style={{ height: 190 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

function DoughnutChart({ txs }) {
  const catMap = groupByCat(txByMonth(txs, marPrefix));
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (sorted.length === 0) {
    return (
      <div className="chart-box">
        <div className="box-head">
          <div className="box-title">Spending split</div>
          <div className="box-sub">This month by category</div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">∅</div>
          No expense data for this month
        </div>
      </div>
    );
  }

  const data = {
    labels: sorted.map((item) => item[0]),
    datasets: [
      {
        data: sorted.map((item) => Math.round(item[1])),
        backgroundColor: PALETTE.slice(0, sorted.length),
        borderWidth: 0,
        hoverOffset: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${fmt(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <div className="box-head">
        <div className="box-title">Spending split</div>
        <div className="box-sub">This month by category</div>
      </div>
      <div className="legend-row">
        {sorted.map(([cat], i) => (
          <span key={cat} className="legend-item">
            <span className="legend-dot" style={{ background: PALETTE[i] }} />
            {cat}
          </span>
        ))}
      </div>
      <div className="chart-wrap" style={{ height: 145 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default function Overview({ onNavigate, onAddClick }) {
  const { state } = useApp();
  const { transactions: txs, role } = state;

  const cur = txByMonth(txs, marPrefix);
  const prev = txByMonth(txs, '2026-02');

  const curInc = sumType(cur, 'income');
  const curExp = sumType(cur, 'expense');
  const prevInc = sumType(prev, 'income');
  const prevExp = sumType(prev, 'expense');
  const balance = txs.reduce((sum, t) => sum + (t.type === 'income' ? t.amt : -t.amt), 0);
  const savRate = curInc > 0 ? Math.round(((curInc - curExp) / curInc) * 100) : 0;
  const di = pct(curInc, prevInc);
  const de = pct(curExp, prevExp);

  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h1 className="page-title">Overview</h1>
          <div className="page-sub">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })}
          </div>
        </div>
        {role === 'admin' && (
          <button className="add-btn" onClick={onAddClick}>
            <PlusIcon /> Add transaction
          </button>
        )}
      </div>

      <div className="stats-grid">
        <StatCard
          label="Net balance"
          value={fmt(balance)}
          delta={`Net ${fmt(curInc - curExp)} this month`}
        />
        <StatCard
          label="Income (Mar)"
          value={fmt(curInc)}
          valueClass="pos"
          delta={
            <><span className={di >= 0 ? 'up' : 'dn'}>{di >= 0 ? '↑' : '↓'}</span> {Math.abs(di)}% vs Feb</>
          }
        />
        <StatCard
          label="Expenses (Mar)"
          value={fmt(curExp)}
          valueClass="neg"
          delta={
            <><span className={de > 0 ? 'dn' : 'up'}>{de > 0 ? '↑' : '↓'}</span> {Math.abs(de)}% vs Feb</>
          }
        />
        <StatCard
          label="Savings rate"
          value={savRate + '%'}
          delta={fmt(curInc - curExp) + ' saved'}
        />
      </div>

      <div className="charts-row">
        <TrendChart txs={txs} />
        <DoughnutChart txs={txs} />
      </div>

      <div className="table-box">
        <div className="table-header">
          <span className="table-title">Recent activity</span>
          <span className="see-all" onClick={() => onNavigate('transactions')}>see all →</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Category</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((t) => (
              <tr key={t.id}>
                <td className="mono muted">{t.date}</td>
                <td>{t.desc}</td>
                <td><span className="pill">{t.cat}</span></td>
                <td className={t.type === 'income' ? 'amt-pos' : 'amt-neg'}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
    </svg>
  );
}