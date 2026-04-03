import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/helpers';

const MONTH_NAMES = {
  '2026-03': 'March 2026', '2026-02': 'Feb 2026',
  '2026-01': 'Jan 2026', '2025-12': 'Dec 2025', '2025-11': 'Nov 2025',
};

export default function Transactions({ onAddClick, onEditClick }) {
  const { state, dispatch } = useApp();
  const { transactions: txs, role, filters, sortKey, sortDir } = state;

  const [localFilters, setLocalFilters] = useState(filters);

  const setF = (k) => (e) => {
    const updated = { ...localFilters, [k]: e.target.value };
    setLocalFilters(updated);
    dispatch({ type: 'SET_FILTERS', payload: updated });
  };

  const cats = useMemo(() => [...new Set(txs.map((t) => t.cat))].sort(), [txs]);
  const months = useMemo(() =>
    [...new Set(txs.map((t) => t.date.slice(0, 7)))].sort().reverse(), [txs]
  );

  const filtered = useMemo(() => {
    const f = localFilters;
    return txs.filter((t) => {
      if (f.search && !t.desc.toLowerCase().includes(f.search.toLowerCase()) &&
        !t.cat.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.type && t.type !== f.type) return false;
      if (f.cat && t.cat !== f.cat) return false;
      if (f.month && !t.date.startsWith(f.month)) return false;
      return true;
    });
  }, [txs, localFilters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === 'date') return a.date.localeCompare(b.date) * sortDir;
      if (sortKey === 'amount') return (a.amt - b.amt) * sortDir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key) {
    dispatch({ type: 'SET_SORT', key });
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this transaction?')) return;
    dispatch({ type: 'DELETE_TX', payload: id });
  }

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h1 className="page-title">Transactions</h1>
          <div className="page-sub">{sorted.length} record{sorted.length !== 1 ? 's' : ''}</div>
        </div>
        {role === 'admin' && (
          <button className="add-btn" onClick={onAddClick}>
            <PlusIcon /> Add
          </button>
        )}
      </div>

      <div className="filters">
        <input
          className="filter-input search"
          placeholder="Search transactions..."
          value={localFilters.search}
          onChange={setF('search')}
        />
        <select className="filter-input" value={localFilters.type} onChange={setF('type')}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-input" value={localFilters.cat} onChange={setF('cat')}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="filter-input" value={localFilters.month} onChange={setF('month')}>
          <option value="">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>{MONTH_NAMES[m] || m}</option>
          ))}
        </select>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>
                Date{' '}
                <button className="sort-btn" onClick={() => toggleSort('date')}>↕</button>
              </th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>
                Amount{' '}
                <button className="sort-btn" onClick={() => toggleSort('amount')}>↕</button>
              </th>
              {role === 'admin' && <th>—</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5}>
                  <div className="empty-state">
                    <div className="empty-icon">∅</div>
                    Nothing matches those filters
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((t) => (
                <tr key={t.id}>
                  <td className="mono muted">{t.date}</td>
                  <td>{t.desc}</td>
                  <td><span className="pill">{t.cat}</span></td>
                  <td><span className={`pill ${t.type}`}>{t.type}</span></td>
                  <td className={t.type === 'income' ? 'amt-pos' : 'amt-neg'}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amt)}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div className="actions">
                        <button className="btn-edit" onClick={() => onEditClick(t)}>edit</button>
                        <button className="btn-del" onClick={() => handleDelete(t.id)}>del</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
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
