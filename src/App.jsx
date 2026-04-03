import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import TxModal from './components/TxModal';
import './App.css';

function AppInner() {
  const [page, setPage] = useState('overview');
  const [modal, setModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  function openAdd() { setEditTx(null); setModal(true); }
  function openEdit(tx) { setEditTx(tx); setModal(true); }
  function closeModal() { setModal(false); setEditTx(null); }

  return (
    <div className="layout">
      <Sidebar activePage={page} onNavigate={setPage} />

      <main className="main-content">
        {page === 'overview' && (
          <Overview onNavigate={setPage} onAddClick={openAdd} />
        )}
        {page === 'transactions' && (
          <Transactions onAddClick={openAdd} onEditClick={openEdit} />
        )}
        {page === 'insights' && <Insights />}
      </main>

      {modal && <TxModal editTx={editTx} onClose={closeModal} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
