import { useApp } from '../context/AppContext';

const links = [
  { id: 'overview',      label: 'Overview',      icon: GridIcon },
  { id: 'transactions',  label: 'Transactions',  icon: ListIcon },
  { id: 'insights',      label: 'Insights',      icon: TrendIcon },
];

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1" y="1" width="5" height="5" rx=".8" />
      <rect x="8" y="1" width="5" height="5" rx=".8" />
      <rect x="1" y="8" width="5" height="5" rx=".8" />
      <rect x="8" y="8" width="5" height="5" rx=".8" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
      <line x1="1" y1="3" x2="13" y2="3" />
      <line x1="1" y1="7" x2="9"  y2="7" />
      <line x1="1" y1="11" x2="11" y2="11" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
      <polyline points="1,11 4,6 7,9 11,2 13,4" />
    </svg>
  );
}

export default function Sidebar({ activePage, onNavigate }) {
  const { state, dispatch } = useApp();
  const { role } = state;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-name">finsight.</div>
        <div className="brand-tag">personal finance</div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-link ${activePage === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-label">Signed in as</div>
        <select
          className="role-select"
          value={role}
          onChange={(e) =>
            dispatch({ type: 'SET_ROLE', payload: e.target.value })
          }
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        {role === 'viewer' && (
          <p className="viewer-note">View-only — switch to Admin to edit</p>
        )}
      </div>
    </aside>
  );
}
