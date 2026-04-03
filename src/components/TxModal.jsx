import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';

export default function TxModal({ editTx, onClose }) {
  const { dispatch } = useApp();

  const [form, setForm] = useState({
    desc: '',
    amt: '',
    type: 'expense',
    cat: 'Food',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (editTx) {
      setForm({
        desc: editTx.desc,
        amt: editTx.amt,
        type: editTx.type,
        cat: editTx.cat,
        date: editTx.date,
      });
    }
  }, [editTx]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSave() {
    if (!form.desc.trim() || !form.amt || !form.date) return;
    const payload = { ...form, amt: parseFloat(form.amt) };
    if (editTx) {
      dispatch({ type: 'EDIT_TX', payload: { ...payload, id: editTx.id } });
    } else {
      dispatch({ type: 'ADD_TX', payload });
    }
    onClose();
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">
          {editTx ? 'Edit transaction' : 'New transaction'}
        </h2>

        <div className="form-group">
          <label>Description</label>
          <input value={form.desc} onChange={set('desc')} placeholder="e.g. Monthly rent" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" value={form.amt} onChange={set('amt')} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={form.cat} onChange={set('cat')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
