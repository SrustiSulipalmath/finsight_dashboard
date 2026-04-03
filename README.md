# Finsight — Personal Finance Dashboard

A clean, dark-themed finance dashboard built with React. Tracks income, expenses, and spending patterns across months.

## Setup

```bash
npm install
npm start
```

Runs on `http://localhost:3000`.

## Features

### Overview
- Net balance, monthly income, expenses, and savings rate cards
- 30-day running balance trend (line chart)
- Category spending breakdown (doughnut chart)
- Recent transactions list

### Transactions
- Full transaction list with search, type, category, and month filters
- Sortable by date or amount
- Add / edit / delete (Admin role only)
- Data persisted to localStorage

### Insights
- Top spending category this month
- Best income month across 6 months
- Average daily spend
- Monthly income vs expenses comparison (bar chart)
- Category breakdown bar chart

### Role-based UI
- **Admin** — can add, edit, and delete transactions
- **Viewer** — read-only; action buttons are hidden
- Switch roles via the dropdown in the sidebar

## Tech

- React 18 with hooks (`useState`, `useReducer`, `useEffect`, `useContext`, `useMemo`)
- Context API for global state (transactions, filters, role, sort)
- Chart.js 4 for charts (loaded from CDN to keep bundle lean)
- CSS custom properties for theming
- `localStorage` for persistence between sessions

## Project structure

```
src/
  components/
    Sidebar.jsx       — navigation + role switcher
    Overview.jsx      — dashboard page with summary + charts
    Transactions.jsx  — transaction list with filters
    Insights.jsx      — analytics and monthly comparison
    TxModal.jsx       — add/edit modal
  context/
    AppContext.jsx     — global state via useReducer
  data/
    transactions.js   — mock data + constants
  utils/
    helpers.js        — shared formatters and aggregators
  App.jsx             — root component + routing
  App.css             — all styles
```

## Design decisions

- Dark-first design with a monospace/serif type pairing that feels intentional, not default
- All charts use Chart.js via CDN — keeps the React bundle small and avoids wrapper libraries
- State is managed entirely with `useReducer` + Context, no external libraries needed
- `localStorage` syncs on every mutation (add/edit/delete) so data survives page reloads
- Role switching is purely frontend — simulated via Context state, no backend needed
- Filters are kept in component-local state and synced to Context, avoiding unnecessary re-renders
