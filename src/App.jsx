import { useState, useEffect, useContext, createContext, useCallback } from "react";

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #0f4c81;
    --primary-light: #1a6bb5;
    --primary-dark: #0a3259;
    --accent: #f0a500;
    --accent-light: #f5c842;
    --surface: #ffffff;
    --surface-2: #f7f8fc;
    --surface-3: #eef1f8;
    --text-primary: #0d1b2e;
    --text-secondary: #4a5568;
    --text-muted: #8899aa;
    --border: #dde3ee;
    --border-focus: #1a6bb5;
    --risk-low: #16a34a;
    --risk-low-bg: #dcfce7;
    --risk-medium: #d97706;
    --risk-medium-bg: #fef3c7;
    --risk-high: #dc2626;
    --risk-high-bg: #fee2e2;
    --shadow-sm: 0 1px 3px rgba(15,76,129,0.08);
    --shadow-md: 0 4px 16px rgba(15,76,129,0.12);
    --shadow-lg: 0 8px 32px rgba(15,76,129,0.16);
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  body { font-family: var(--font-body); color: var(--text-primary); background: var(--surface-2); }

  /* NAVBAR */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: var(--primary-dark);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 0 2rem;
    display: flex; align-items: center; gap: 2rem;
    height: 60px;
    box-shadow: var(--shadow-md);
  }
  .navbar-brand {
    font-family: var(--font-display); font-size: 1.25rem;
    color: white; letter-spacing: 0.01em; white-space: nowrap;
  }
  .navbar-brand span { color: var(--accent); }
  .navbar-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-link {
    padding: 0.4rem 0.85rem; border-radius: var(--radius-sm);
    color: rgba(255,255,255,0.72); font-size: 0.875rem; font-weight: 400;
    cursor: pointer; border: none; background: none;
    transition: background var(--transition), color var(--transition);
  }
  .nav-link:hover { background: rgba(255,255,255,0.1); color: white; }
  .nav-link.active { background: rgba(255,255,255,0.15); color: white; font-weight: 500; }
  .portfolio-badge {
    background: var(--accent); color: var(--primary-dark);
    font-size: 0.7rem; font-weight: 600; padding: 1px 6px;
    border-radius: 99px; margin-left: 4px; vertical-align: middle;
  }

  /* PAGE WRAPPER */
  .page { min-height: calc(100vh - 60px); }
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
  .container-narrow { max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem; }

  /* HOME PAGE */
  .hero {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, #1d5fa0 100%);
    padding: 5rem 2rem 4rem; text-align: center; color: white;
  }
  .hero-eyebrow {
    display: inline-block; background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: var(--accent-light); font-size: 0.8rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.3rem 1rem; border-radius: 99px; margin-bottom: 1.5rem;
  }
  .hero h1 { font-family: var(--font-display); font-size: clamp(2.2rem,5vw,3.6rem); line-height: 1.15; margin-bottom: 1.25rem; }
  .hero h1 em { color: var(--accent-light); font-style: italic; }
  .hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.75); max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.65; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.5rem; border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 500; cursor: pointer; border: none; transition: all var(--transition); font-family: var(--font-body); }
  .btn-primary { background: var(--accent); color: var(--primary-dark); }
  .btn-primary:hover { background: var(--accent-light); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-outline { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.4); }
  .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }
  .btn-secondary { background: var(--surface-3); color: var(--primary); }
  .btn-secondary:hover { background: var(--border); }
  .btn-danger { background: var(--risk-high-bg); color: var(--risk-high); }
  .btn-danger:hover { background: #fecaca; }
  .btn-sm { padding: 0.4rem 0.9rem; font-size: 0.8rem; }
  .btn-full { width: 100%; justify-content: center; }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

  .stats-bar {
    display: flex; justify-content: center; gap: 3rem;
    padding: 1.75rem 2rem; background: white;
    border-bottom: 1px solid var(--border); flex-wrap: wrap;
  }
  .stat-item { text-align: center; }
  .stat-num { font-family: var(--font-display); font-size: 1.8rem; color: var(--primary); line-height: 1; }
  .stat-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem; letter-spacing: 0.04em; text-transform: uppercase; }

  .section-header { text-align: center; margin-bottom: 2.5rem; }
  .section-header h2 { font-family: var(--font-display); font-size: 2rem; color: var(--text-primary); margin-bottom: 0.6rem; }
  .section-header p { color: var(--text-secondary); font-size: 1rem; }

  .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 3rem; }
  .category-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 1.5rem; text-align: center; cursor: pointer;
    transition: all var(--transition); box-shadow: var(--shadow-sm);
  }
  .category-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
  .category-icon { font-size: 2rem; margin-bottom: 0.75rem; display: block; }
  .category-card h3 { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
  .category-card p { font-size: 0.78rem; color: var(--text-muted); }

  /* PRODUCT CARD */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
  .product-card {
    background: white; border: 1px solid var(--border); border-radius: var(--radius-lg);
    overflow: hidden; box-shadow: var(--shadow-sm);
    transition: all var(--transition); position: relative;
    display: flex; flex-direction: column;
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-focus); }
  .product-card-header { padding: 1.25rem 1.25rem 0.75rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
  .product-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
  .product-body { padding: 0 1.25rem 1rem; flex: 1; }
  .product-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.75rem; }
  .metric { background: var(--surface-2); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; }
  .metric-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.15rem; }
  .metric-value { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
  .metric-value.return { color: var(--primary); }
  .product-footer { padding: 0.75rem 1.25rem 1.25rem; display: flex; gap: 0.6rem; border-top: 1px solid var(--surface-3); margin-top: auto; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.22rem 0.6rem; border-radius: 99px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.02em; }
  .badge-category { background: var(--surface-3); color: var(--primary); }
  .badge-low { background: var(--risk-low-bg); color: var(--risk-low); }
  .badge-medium { background: var(--risk-medium-bg); color: var(--risk-medium); }
  .badge-high { background: var(--risk-high-bg); color: var(--risk-high); }

  /* DETAILS OVERLAY (hover reveal) */
  .details-overlay {
    position: absolute; inset: 0; background: rgba(15,76,129,0.93);
    color: white; padding: 1.5rem; opacity: 0;
    transition: opacity 0.28s ease; border-radius: var(--radius-lg);
    display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;
    pointer-events: none;
  }
  .product-card:hover .details-overlay { opacity: 1; pointer-events: auto; }
  .overlay-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
  .overlay-label { color: rgba(255,255,255,0.65); }
  .overlay-val { font-weight: 600; }

  /* FILTERS */
  .listing-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; align-items: start; }
  @media(max-width:768px){ .listing-layout { grid-template-columns: 1fr; } }
  .filter-panel { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); position: sticky; top: 76px; }
  .filter-panel h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-primary); display: flex; justify-content: space-between; align-items: center; }
  .filter-section { margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--surface-3); }
  .filter-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .filter-label { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.6rem; display: block; }
  .checkbox-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .checkbox-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
  .checkbox-item input { accent-color: var(--primary); }
  .range-row { display: flex; gap: 0.5rem; align-items: center; }
  .range-input { width: 100%; accent-color: var(--primary); }
  .filter-count { font-size: 0.78rem; color: var(--text-muted); margin-top: 1rem; }
  select, input[type="number"], input[type="text"], textarea {
    width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 0.875rem; font-family: var(--font-body);
    background: white; color: var(--text-primary); outline: none;
    transition: border-color var(--transition);
  }
  select:focus, input:focus, textarea:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(26,107,181,0.12); }

  /* PRODUCT DETAIL */
  .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
  @media(max-width:900px){ .detail-layout { grid-template-columns: 1fr; } }
  .detail-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm); margin-bottom: 1.25rem; }
  .detail-card h2 { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem; }
  .detail-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text-primary); }
  .attrs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .attr-box { background: var(--surface-2); border-radius: var(--radius-md); padding: 0.85rem 1rem; }
  .attr-box .label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.25rem; }
  .attr-box .val { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); }
  .risk-bar-wrap { background: var(--surface-3); border-radius: 99px; height: 10px; margin: 0.75rem 0; overflow: hidden; }
  .risk-bar { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .risk-bar.low { background: var(--risk-low); width: 33%; }
  .risk-bar.medium { background: var(--risk-medium); width: 66%; }
  .risk-bar.high { background: var(--risk-high); width: 100%; }
  .insight-box { background: #e8f0fb; border-left: 3px solid var(--primary); border-radius: 0 var(--radius-md) var(--radius-md) 0; padding: 1rem 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; }

  /* CALCULATOR */
  .calc-result { background: var(--primary); color: white; border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem; }
  .calc-result-row { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.12); font-size: 0.875rem; }
  .calc-result-row:last-child { border-bottom: none; }
  .calc-result-row .amount { font-weight: 600; color: var(--accent-light); }

  /* COMPARISON */
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .compare-col { background: var(--surface-2); border-radius: var(--radius-md); padding: 1rem; }
  .compare-col h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--primary); }
  .compare-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.3rem 0; border-bottom: 1px solid var(--border); }
  .compare-row:last-child { border-bottom: none; }
  .compare-row .clabel { color: var(--text-muted); }
  .compare-row .cval { font-weight: 500; }

  /* PROFILE */
  .profile-form-section { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm); }
  .profile-form-section h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--primary); padding-bottom: 0.75rem; border-bottom: 1px solid var(--surface-3); }
  .radio-group { display: flex; flex-direction: column; gap: 0.6rem; }
  .radio-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition); }
  .radio-item.selected { border-color: var(--primary); background: #e8f0fb; }
  .radio-item input { accent-color: var(--primary); margin-top: 2px; }
  .radio-item-content h4 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
  .radio-item-content p { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.1rem; }
  .form-row { margin-bottom: 1.25rem; }
  .form-label { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.4rem; display: block; }
  .form-error { font-size: 0.78rem; color: var(--risk-high); margin-top: 0.25rem; }
  .profile-summary { background: var(--primary); color: white; border-radius: var(--radius-lg); padding: 1.5rem; }
  .profile-summary h3 { font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 1rem; color: var(--accent-light); }
  .summary-item { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; }
  .summary-item:last-child { border-bottom: none; }
  .summary-key { color: rgba(255,255,255,0.65); }
  .summary-val { font-weight: 500; }
  .match-count { background: var(--accent); color: var(--primary-dark); border-radius: var(--radius-md); padding: 0.75rem 1rem; text-align: center; margin-top: 1rem; font-weight: 600; font-size: 0.9rem; }

  /* PORTFOLIO */
  .portfolio-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
  @media(max-width:900px){ .portfolio-layout { grid-template-columns: 1fr; } }
  .portfolio-item { background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
  .portfolio-item-name { flex: 1; font-weight: 600; font-size: 0.9rem; }
  .portfolio-item-meta { font-size: 0.78rem; color: var(--text-muted); }
  .portfolio-item-amount input { width: 110px; text-align: right; }
  .portfolio-stats { background: var(--primary-dark); color: white; border-radius: var(--radius-lg); padding: 1.5rem; position: sticky; top: 76px; }
  .portfolio-stats h3 { font-family: var(--font-display); font-size: 1.2rem; color: var(--accent-light); margin-bottom: 1.25rem; }
  .stat-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.875rem; }
  .stat-row:last-child { border-bottom: none; }
  .stat-row .sk { color: rgba(255,255,255,0.6); }
  .stat-row .sv { font-weight: 600; color: var(--accent-light); }
  .risk-dist { margin-top: 1rem; }
  .risk-dist-bar { display: flex; height: 10px; border-radius: 99px; overflow: hidden; margin: 0.5rem 0; }
  .risk-dist-segment { transition: width 0.5s ease; }
  .risk-dist-legend { display: flex; gap: 1rem; font-size: 0.75rem; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
  .warning-box { background: rgba(220,38,38,0.18); border: 1px solid rgba(220,38,38,0.4); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-top: 1rem; font-size: 0.82rem; color: #fca5a5; }
  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
  .empty-state .emoji { font-size: 3rem; margin-bottom: 1rem; display: block; }
  .empty-state h3 { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.5rem; }

  /* RECOMMENDATIONS */
  .rec-header { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem; }
  .rec-header h2 { font-family: var(--font-display); font-size: 1.75rem; margin-bottom: 0.5rem; }
  .rec-header p { color: rgba(255,255,255,0.75); font-size: 0.9rem; }

  /* ANIMATIONS */
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-in { animation: fadeInUp 0.4s ease both; }
  .fade-in-delay-1 { animation: fadeInUp 0.4s 0.08s ease both; }
  .fade-in-delay-2 { animation: fadeInUp 0.4s 0.16s ease both; }

  .add-btn { transition: all var(--transition); }
  .add-btn.added { background: var(--risk-low-bg); color: var(--risk-low); }

  /* 404 */
  .notfound { text-align: center; padding: 6rem 2rem; }
  .notfound h1 { font-family: var(--font-display); font-size: 5rem; color: var(--border); margin-bottom: 0.5rem; }
  .notfound h2 { font-size: 1.4rem; color: var(--text-secondary); margin-bottom: 1rem; }
  .notfound p { color: var(--text-muted); margin-bottom: 2rem; }

  @media(max-width:600px){
    .attrs-grid { grid-template-columns: 1fr; }
    .compare-grid { grid-template-columns: 1fr; }
    .product-metrics { grid-template-columns: 1fr 1fr; }
    .stats-bar { gap: 1.5rem; }
    .hero { padding: 3rem 1rem 2.5rem; }
    .hero h1 { font-size: 2rem; }
  }
`;

// ============================================================
// CONTEXT API
// ============================================================
const PortfolioContext = createContext();
const UserProfileContext = createContext();

function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState({ items: [] });

  const addToPortfolio = useCallback((product, amount = 10000) => {
    setPortfolio(prev => {
      if (prev.items.find(i => i.id === product.id)) return prev;
      return { ...prev, items: [...prev.items, { ...product, allocatedAmount: amount }] };
    });
  }, []);

  const removeFromPortfolio = useCallback((productId) => {
    setPortfolio(prev => ({ ...prev, items: prev.items.filter(i => i.id !== productId) }));
  }, []);

  const updateAllocation = useCallback((productId, newAmount) => {
    setPortfolio(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === productId ? { ...i, allocatedAmount: Math.max(0, newAmount) } : i)
    }));
  }, []);

  const calculatePortfolioStats = useCallback(() => {
    const items = portfolio.items;
    if (items.length === 0) return { totalInvested: 0, weightedReturn: 0, riskDistribution: { low: 0, medium: 0, high: 0 }, categoryDistribution: {} };
    const totalInvested = items.reduce((sum, i) => sum + i.allocatedAmount, 0);
    const weightedReturn = totalInvested > 0
      ? items.reduce((sum, i) => sum + (i.allocatedAmount / totalInvested) * i.expectedReturn, 0)
      : 0;
    const riskDistribution = { low: 0, medium: 0, high: 0 };
    const categoryDistribution = {};
    items.forEach(i => {
      riskDistribution[i.riskLevel] += i.allocatedAmount;
      categoryDistribution[i.category] = (categoryDistribution[i.category] || 0) + i.allocatedAmount;
    });
    Object.keys(riskDistribution).forEach(k => {
      riskDistribution[k] = totalInvested > 0 ? (riskDistribution[k] / totalInvested) * 100 : 0;
    });
    Object.keys(categoryDistribution).forEach(k => {
      categoryDistribution[k] = totalInvested > 0 ? (categoryDistribution[k] / totalInvested) * 100 : 0;
    });
    return { totalInvested, weightedReturn, riskDistribution, categoryDistribution };
  }, [portfolio.items]);

  return (
    <PortfolioContext.Provider value={{ portfolio, addToPortfolio, removeFromPortfolio, updateAllocation, calculatePortfolioStats }}>
      {children}
    </PortfolioContext.Provider>
  );
}

function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  const updateProfile = useCallback((newProfile) => setProfile(newProfile), []);

  const getRecommendations = useCallback((products) => {
    if (!profile) return [];
    const riskMapping = { conservative: ['low'], moderate: ['low', 'medium'], aggressive: ['low', 'medium', 'high'] };
    const horizonMapping = { short: ['short'], medium: ['short', 'medium'], long: ['short', 'medium', 'long'] };
    const liquidityMapping = { easy: ['easy'], moderate: ['easy', 'moderate'], locked: ['easy', 'moderate', 'locked'] };
    const allowedRisk = riskMapping[profile.riskTolerance] || ['low'];
    const allowedHorizon = horizonMapping[profile.investmentHorizon] || ['short'];
    const allowedLiquidity = liquidityMapping[profile.liquidityPreference] || ['easy'];
    const recommended = products.filter(p =>
      p.minInvestment <= profile.monthlyCapacity &&
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
    );
    if (profile.riskTolerance === 'conservative') {
      return recommended.sort((a, b) => a.riskLevel.localeCompare(b.riskLevel) || b.liquidity.localeCompare(a.liquidity));
    }
    return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
  }, [profile]);

  const isProfileComplete = useCallback(() =>
    profile && profile.riskTolerance && profile.investmentHorizon && profile.monthlyCapacity > 0 && profile.liquidityPreference && profile.investmentGoal,
    [profile]);

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, getRecommendations, isProfileComplete }}>
      {children}
    </UserProfileContext.Provider>
  );
}

// ============================================================
// DATA TRANSFORMATION (API → Financial Products)
// ============================================================
function assignLiquidity(category, riskLevel) {
  if (category === 'savings') return 'easy';
  if (category === 'insurance') return 'locked';
  if (category === 'crypto') return 'easy';
  if (riskLevel === 'high') return 'moderate';
  return 'moderate';
}
function assignTimeHorizon(riskLevel) {
  if (riskLevel === 'low') return 'short';
  if (riskLevel === 'medium') return 'medium';
  return 'long';
}
function transformToFinancialProduct(apiProduct) {
  const categoryMapping = {
    'electronics': 'investment',
    'jewelery': 'savings',
    "men's clothing": 'insurance',
    "women's clothing": 'crypto'
  };
  const riskMapping = { investment: 'medium', savings: 'low', insurance: 'low', crypto: 'high' };
  // Deterministic return based on id (not random per render)
  const returnSeeds = { low: [3.2, 4.1, 4.8, 5.5, 6.0, 6.7, 5.2, 4.4, 3.8, 6.2], medium: [7.4, 8.1, 9.3, 10.2, 11.0, 8.8, 9.7, 7.8, 10.5, 11.8], high: [13.5, 16.2, 18.7, 22.4, 25.0, 14.8, 19.3, 21.0, 17.6, 15.4] };
  const category = categoryMapping[apiProduct.category] || 'investment';
  const riskLevel = riskMapping[category];
  const seedArr = returnSeeds[riskLevel];
  const expectedReturn = parseFloat((seedArr[apiProduct.id % seedArr.length]).toFixed(2));
  return {
    id: apiProduct.id,
    name: apiProduct.title.length > 48 ? apiProduct.title.slice(0, 45) + '…' : apiProduct.title,
    category,
    description: apiProduct.description,
    minInvestment: Math.round(apiProduct.price * 1000 / 100) * 100,
    riskLevel,
    expectedReturn,
    liquidity: assignLiquidity(category, riskLevel),
    timeHorizon: assignTimeHorizon(riskLevel),
    image: apiProduct.image
  };
}

// ============================================================
// UTILITY
// ============================================================
function generateDecisionInsight(product) {
  const insights = [];
  if (product.riskLevel === 'low') insights.push("Suitable for conservative investors prioritizing capital preservation.");
  else if (product.riskLevel === 'medium') insights.push("Balanced option for moderate investors seeking growth with managed risk.");
  else insights.push("Best for aggressive investors comfortable with significant volatility.");
  if (product.liquidity === 'locked') insights.push("Requires commitment; early withdrawal may incur penalties.");
  else if (product.liquidity === 'easy') insights.push("Highly liquid — funds can be accessed quickly when needed.");
  if (product.timeHorizon === 'long') insights.push("Optimal when held for 5+ years to maximize compounding returns.");
  else if (product.timeHorizon === 'short') insights.push("Suitable for near-term goals within 1–2 years.");
  if (product.expectedReturn > 15) insights.push("High return potential — monitor market conditions regularly.");
  return insights.join(" ");
}

function calcProjectedReturns(amount, annualReturn, years) {
  const r = annualReturn / 100;
  return Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    return { year: y, simple: amount + amount * r * y, compound: amount * Math.pow(1 + r, y) };
  });
}

const CATEGORY_META = {
  savings: { icon: '🏦', label: 'Savings', desc: 'Safe & steady' },
  investment: { icon: '📈', label: 'Investment', desc: 'Growth focused' },
  insurance: { icon: '🛡️', label: 'Insurance', desc: 'Protected returns' },
  crypto: { icon: '₿', label: 'Crypto', desc: 'High volatility' }
};

function formatPKR(n) { return `PKR ${Number(n).toLocaleString()}`; }

// ============================================================
// REUSABLE COMPONENTS
// ============================================================
function RiskBadge({ riskLevel, size = 'sm' }) {
  const cls = size === 'sm' ? 'badge' : 'badge';
  return <span className={`${cls} badge-${riskLevel}`}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</span>;
}

function ReturnDisplay({ value }) {
  return <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{value.toFixed(2)}% p.a.</span>;
}

function ProductCard({ product, onAddToPortfolio, isInPortfolio, onViewDetail }) {
  const [added, setAdded] = useState(isInPortfolio);
  useEffect(() => setAdded(isInPortfolio), [isInPortfolio]);
  const handleAdd = () => {
    if (!added) { onAddToPortfolio(product, product.minInvestment); setAdded(true); }
  };
  const catMeta = CATEGORY_META[product.category] || { icon: '💰', label: product.category };
  return (
    <div className="product-card fade-in">
      <div className="details-overlay">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</div>
        <div className="overlay-row"><span className="overlay-label">Expected Return</span><span className="overlay-val" style={{ color: 'var(--accent-light)' }}>{product.expectedReturn}% p.a.</span></div>
        <div className="overlay-row"><span className="overlay-label">Risk Level</span><RiskBadge riskLevel={product.riskLevel} /></div>
        <div className="overlay-row"><span className="overlay-label">Liquidity</span><span className="overlay-val">{product.liquidity}</span></div>
        <div className="overlay-row"><span className="overlay-label">Time Horizon</span><span className="overlay-val">{product.timeHorizon}</span></div>
        <div className="overlay-row"><span className="overlay-label">Min. Investment</span><span className="overlay-val">{formatPKR(product.minInvestment)}</span></div>
      </div>
      <div className="product-card-header">
        <div className="product-name">{product.name}</div>
        <span className="badge badge-category">{catMeta.icon} {catMeta.label}</span>
      </div>
      <div className="product-body">
        <p className="product-desc">{product.description}</p>
        <div className="product-metrics">
          <div className="metric"><div className="metric-label">Return</div><div className="metric-value return">{product.expectedReturn}%</div></div>
          <div className="metric"><div className="metric-label">Risk</div><div className="metric-value"><RiskBadge riskLevel={product.riskLevel} /></div></div>
          <div className="metric"><div className="metric-label">Liquidity</div><div className="metric-value" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{product.liquidity}</div></div>
          <div className="metric"><div className="metric-label">Min. Invest</div><div className="metric-value" style={{ fontSize: '0.78rem' }}>{formatPKR(product.minInvestment)}</div></div>
        </div>
      </div>
      <div className="product-footer">
        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onViewDetail(product.id)}>View Details</button>
        <button className={`btn btn-sm add-btn ${added ? 'added' : 'btn-primary'}`} style={{ flex: 1 }} onClick={handleAdd} disabled={added}>
          {added ? '✓ Added' : '+ Portfolio'}
        </button>
      </div>
    </div>
  );
}

function FilterPanel({ filters, onFilterChange, productCount, totalCount }) {
  const handleCheck = (field, value) => {
    const arr = filters[field] || [];
    const updated = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onFilterChange({ ...filters, [field]: updated });
  };
  return (
    <div className="filter-panel">
      <h3>Filters <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }} onClick={() => onFilterChange({ riskLevel: [], category: [], liquidity: 'all', timeHorizon: 'all', minReturn: 0, maxReturn: 30, maxMinInvestment: 500000 })}>Reset</button></h3>

      <div className="filter-section">
        <span className="filter-label">Risk Level</span>
        <div className="checkbox-group">
          {['low', 'medium', 'high'].map(r => (
            <label key={r} className="checkbox-item">
              <input type="checkbox" checked={(filters.riskLevel || []).includes(r)} onChange={() => handleCheck('riskLevel', r)} />
              <RiskBadge riskLevel={r} />
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Category</span>
        <div className="checkbox-group">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <label key={key} className="checkbox-item">
              <input type="checkbox" checked={(filters.category || []).includes(key)} onChange={() => handleCheck('category', key)} />
              {meta.icon} {meta.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Return Range ({filters.minReturn || 0}% – {filters.maxReturn || 30}%)</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className="range-row"><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min</span>
            <input type="range" className="range-input" min="0" max="30" step="0.5" value={filters.minReturn || 0} onChange={e => onFilterChange({ ...filters, minReturn: parseFloat(e.target.value) })} style={{ width: '100%' }} /></div>
          <div className="range-row"><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max</span>
            <input type="range" className="range-input" min="0" max="30" step="0.5" value={filters.maxReturn || 30} onChange={e => onFilterChange({ ...filters, maxReturn: parseFloat(e.target.value) })} style={{ width: '100%' }} /></div>
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Liquidity</span>
        <select value={filters.liquidity || 'all'} onChange={e => onFilterChange({ ...filters, liquidity: e.target.value })}>
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div className="filter-section">
        <span className="filter-label">Time Horizon</span>
        <select value={filters.timeHorizon || 'all'} onChange={e => onFilterChange({ ...filters, timeHorizon: e.target.value })}>
          <option value="all">All</option>
          <option value="short">Short (1–2 yrs)</option>
          <option value="medium">Medium (3–5 yrs)</option>
          <option value="long">Long (5+ yrs)</option>
        </select>
      </div>

      <div className="filter-section">
        <span className="filter-label">Max Min. Investment (PKR)</span>
        <input type="number" step="5000" min="0" max="500000" value={filters.maxMinInvestment || 500000} onChange={e => onFilterChange({ ...filters, maxMinInvestment: parseInt(e.target.value) || 500000 })} />
      </div>

      <p className="filter-count">Showing <strong>{productCount}</strong> of {totalCount} products</p>
    </div>
  );
}

function ProductList({ products, filters, onFilterChange, portfolio, onAddToPortfolio, onViewDetail }) {
  const filtered = products.filter(p =>
    (filters.riskLevel.length === 0 || filters.riskLevel.includes(p.riskLevel)) &&
    p.expectedReturn >= filters.minReturn && p.expectedReturn <= filters.maxReturn &&
    (filters.category.length === 0 || filters.category.includes(p.category)) &&
    (filters.liquidity === 'all' || p.liquidity === filters.liquidity) &&
    (filters.timeHorizon === 'all' || p.timeHorizon === filters.timeHorizon) &&
    p.minInvestment <= filters.maxMinInvestment
  );
  return (
    <div>
      {filtered.length === 0
        ? <div className="empty-state"><span className="emoji">🔍</span><h3>No products match your filters</h3><p>Try adjusting your filter criteria.</p></div>
        : <div className="products-grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddToPortfolio={onAddToPortfolio} isInPortfolio={portfolio.items.some(i => i.id === p.id)} onViewDetail={onViewDetail} />
          ))}
        </div>}
    </div>
  );
}

function PortfolioSummary({ stats, items }) {
  const highRiskPct = stats.riskDistribution?.high || 0;
  return (
    <div className="portfolio-stats">
      <h3>Portfolio Summary</h3>
      <div className="stat-row"><span className="sk">Total Invested</span><span className="sv">{formatPKR(stats.totalInvested.toFixed(0))}</span></div>
      <div className="stat-row"><span className="sk">Weighted Return</span><span className="sv">{stats.weightedReturn.toFixed(2)}% p.a.</span></div>
      <div className="stat-row"><span className="sk">Products</span><span className="sv">{items.length}</span></div>

      <div className="risk-dist" style={{ marginTop: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Risk Distribution</div>
        <div className="risk-dist-bar">
          <div className="risk-dist-segment" style={{ width: `${stats.riskDistribution.low}%`, background: 'var(--risk-low)' }} />
          <div className="risk-dist-segment" style={{ width: `${stats.riskDistribution.medium}%`, background: 'var(--risk-medium)' }} />
          <div className="risk-dist-segment" style={{ width: `${stats.riskDistribution.high}%`, background: 'var(--risk-high)' }} />
        </div>
        <div className="risk-dist-legend">
          <span><span className="legend-dot" style={{ background: 'var(--risk-low)' }} />Low {stats.riskDistribution.low.toFixed(0)}%</span>
          <span><span className="legend-dot" style={{ background: 'var(--risk-medium)' }} />Med {stats.riskDistribution.medium.toFixed(0)}%</span>
          <span><span className="legend-dot" style={{ background: 'var(--risk-high)' }} />High {stats.riskDistribution.high.toFixed(0)}%</span>
        </div>
      </div>

      {highRiskPct > 70 && (
        <div className="warning-box">⚠ Portfolio has {highRiskPct.toFixed(0)}% high-risk exposure. Consider diversifying.</div>
      )}
    </div>
  );
}

function PortfolioItem({ item, onRemove, onUpdateAmount }) {
  const [amount, setAmount] = useState(item.allocatedAmount);
  return (
    <div className="portfolio-item">
      <div style={{ flex: '0 0 auto' }}><RiskBadge riskLevel={item.riskLevel} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="portfolio-item-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div className="portfolio-item-meta">{item.expectedReturn}% p.a. · {item.category}</div>
      </div>
      <div className="portfolio-item-amount">
        <input type="number" step="1000" min="0" value={amount}
          onChange={e => setAmount(parseInt(e.target.value) || 0)}
          onBlur={() => onUpdateAmount(item.id, amount)}
          style={{ width: '120px', textAlign: 'right' }} />
      </div>
      <button className="btn btn-danger btn-sm" onClick={() => onRemove(item.id)}>✕</button>
    </div>
  );
}

function RecommendationList({ recommendations, profile, onAddToPortfolio, portfolio, onViewDetail }) {
  if (!profile) return null;
  if (recommendations.length === 0) return (
    <div className="empty-state"><span className="emoji">🎯</span><h3>No matches for your profile</h3><p>Try updating your financial profile with different preferences.</p></div>
  );
  return (
    <div className="products-grid">
      {recommendations.map(p => (
        <ProductCard key={p.id} product={p} onAddToPortfolio={onAddToPortfolio} isInPortfolio={portfolio.items.some(i => i.id === p.id)} onViewDetail={onViewDetail} />
      ))}
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================

// HOME PAGE
function HomePage({ products, setPage, onAddToPortfolio, portfolio }) {
  const featured = (() => {
    const cats = ['savings', 'investment', 'insurance', 'crypto'];
    return cats.map(cat => {
      const group = products.filter(p => p.category === cat);
      if (!group.length) return null;
      return group.reduce((best, p) => (p.expectedReturn > best.expectedReturn ? p : best), group[0]);
    }).filter(Boolean).slice(0, 4);
  })();

  return (
    <div className="page fade-in">
      <div className="hero">
        <div className="hero-eyebrow">BS FinTech · FAST University</div>
        <h1>Discover Financial<br /><em>Products That Fit You</em></h1>
        <p className="hero-sub">Explore savings accounts, mutual funds, insurance plans, and crypto assets — with real risk assessments and personalized recommendations.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setPage('profile')}>Create My Profile →</button>
          <button className="btn btn-outline" onClick={() => setPage('products')}>Browse All Products</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item"><div className="stat-num">{products.length}</div><div className="stat-label">Total Products</div></div>
        <div className="stat-item"><div className="stat-num">4</div><div className="stat-label">Categories</div></div>
        <div className="stat-item"><div className="stat-num">{products.filter(p => p.riskLevel === 'low').length}</div><div className="stat-label">Low Risk Options</div></div>
        <div className="stat-item"><div className="stat-num">{products.length > 0 ? (products.reduce((s, p) => s + p.expectedReturn, 0) / products.length).toFixed(1) : 0}%</div><div className="stat-label">Avg. Return</div></div>
      </div>

      <div className="container">
        <div className="section-header" style={{ marginTop: '2.5rem' }}>
          <h2>Explore by Category</h2>
          <p>Click a category to filter products instantly</p>
        </div>
        <div className="categories-grid">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <div key={key} className="category-card" onClick={() => setPage('products', key)}>
              <span className="category-icon">{meta.icon}</span>
              <h3>{meta.label}</h3>
              <p>{meta.desc}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{products.filter(p => p.category === key).length} products →</div>
            </div>
          ))}
        </div>

        {featured.length > 0 && <>
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Top-performing product from each category</p>
          </div>
          <div className="products-grid">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToPortfolio={onAddToPortfolio} isInPortfolio={portfolio.items.some(i => i.id === p.id)} onViewDetail={(id) => setPage('detail', id)} />
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}

// PRODUCT LISTING PAGE
function ProductListingPage({ products, initialCategory, portfolio, onAddToPortfolio, setPage }) {
  const [filters, setFilters] = useState({
    riskLevel: [], category: initialCategory ? [initialCategory] : [],
    liquidity: 'all', timeHorizon: 'all', minReturn: 0, maxReturn: 30, maxMinInvestment: 500000
  });
  const filtered = products.filter(p =>
    (filters.riskLevel.length === 0 || filters.riskLevel.includes(p.riskLevel)) &&
    p.expectedReturn >= filters.minReturn && p.expectedReturn <= filters.maxReturn &&
    (filters.category.length === 0 || filters.category.includes(p.category)) &&
    (filters.liquidity === 'all' || p.liquidity === filters.liquidity) &&
    (filters.timeHorizon === 'all' || p.timeHorizon === filters.timeHorizon) &&
    p.minInvestment <= filters.maxMinInvestment
  );
  return (
    <div className="page fade-in">
      <div style={{ background: 'var(--primary)', padding: '2rem', color: 'white' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>All Financial Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.4rem' }}>Use the filters to find products matching your needs</p>
        </div>
      </div>
      <div className="container">
        <div className="listing-layout" style={{ marginTop: '2rem' }}>
          <FilterPanel filters={filters} onFilterChange={setFilters} productCount={filtered.length} totalCount={products.length} />
          <ProductList products={products} filters={filters} onFilterChange={setFilters} portfolio={portfolio} onAddToPortfolio={onAddToPortfolio} onViewDetail={(id) => setPage('detail', id)} />
        </div>
      </div>
    </div>
  );
}

// PRODUCT DETAIL PAGE
function ProductDetailPage({ product, products, portfolio, onAddToPortfolio, setPage }) {
  const [amount, setAmount] = useState(product.minInvestment);
  const [years, setYears] = useState(5);
  const [compareId, setCompareId] = useState('');
  const isInPortfolio = portfolio.items.some(i => i.id === product.id);
  const [added, setAdded] = useState(isInPortfolio);
  const projections = calcProjectedReturns(amount, product.expectedReturn, years);
  const compareProduct = products.find(p => p.id === parseInt(compareId));
  const insight = generateDecisionInsight(product);

  const handleAdd = () => { if (!added) { onAddToPortfolio(product, amount); setAdded(true); } };

  return (
    <div className="page fade-in">
      <div style={{ background: 'var(--primary)', padding: '2rem', color: 'white' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <button className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }} onClick={() => setPage('products')}>← Back to Products</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2.2rem)', lineHeight: 1.2 }}>{product.name}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-category">{CATEGORY_META[product.category]?.icon} {product.category}</span>
                <RiskBadge riskLevel={product.riskLevel} />
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--accent-light)' }}>{product.expectedReturn}%</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>Expected Annual Return</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout" style={{ marginTop: '2rem' }}>
          <div>
            {/* Attributes */}
            <div className="detail-card fade-in">
              <h3>Product Attributes</h3>
              <div className="attrs-grid">
                <div className="attr-box"><div className="label">Expected Return</div><div className="val" style={{ color: 'var(--primary)' }}>{product.expectedReturn}% p.a.</div></div>
                <div className="attr-box"><div className="label">Risk Level</div><div className="val"><RiskBadge riskLevel={product.riskLevel} /></div></div>
                <div className="attr-box"><div className="label">Liquidity</div><div className="val" style={{ textTransform: 'capitalize' }}>{product.liquidity}</div></div>
                <div className="attr-box"><div className="label">Time Horizon</div><div className="val" style={{ textTransform: 'capitalize' }}>{product.timeHorizon}</div></div>
                <div className="attr-box"><div className="label">Min. Investment</div><div className="val">{formatPKR(product.minInvestment)}</div></div>
                <div className="attr-box"><div className="label">Category</div><div className="val" style={{ textTransform: 'capitalize' }}>{product.category}</div></div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Risk Visualization</div>
                <div className="risk-bar-wrap"><div className={`risk-bar ${product.riskLevel}`} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}><span>Low</span><span>Medium</span><span>High</span></div>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <h3>Description</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{product.description}</p>
              </div>
            </div>

            {/* Decision Insight */}
            <div className="detail-card fade-in-delay-1">
              <h3>🎯 Decision Insight</h3>
              <div className="insight-box">{insight}</div>
            </div>

            {/* Return Calculator */}
            <div className="detail-card fade-in-delay-2">
              <h3>📊 Return Projection Calculator</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-row">
                  <label className="form-label">Investment Amount (PKR)</label>
                  <input type="number" step="1000" min={product.minInvestment} value={amount} onChange={e => setAmount(Math.max(product.minInvestment, parseInt(e.target.value) || product.minInvestment))} />
                </div>
                <div className="form-row">
                  <label className="form-label">Time Period (Years)</label>
                  <select value={years} onChange={e => setYears(parseInt(e.target.value))}>
                    {[1, 2, 3, 5, 7, 10].map(y => <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="calc-result">
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Projections at {product.expectedReturn}% p.a.</div>
                {projections.map(row => (
                  <div key={row.year} className="calc-result-row">
                    <span>Year {row.year}</span>
                    <span>Simple: <span className="amount">{formatPKR(row.simple.toFixed(0))}</span></span>
                    <span>Compound: <span className="amount">{formatPKR(row.compound.toFixed(0))}</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison */}
            <div className="detail-card">
              <h3>⚖ Compare with Another Product</h3>
              <div className="form-row">
                <select value={compareId} onChange={e => setCompareId(e.target.value)}>
                  <option value="">Select a product to compare…</option>
                  {products.filter(p => p.id !== product.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              {compareProduct && (
                <div className="compare-grid">
                  {[product, compareProduct].map((cp, idx) => (
                    <div key={idx} className="compare-col">
                      <h4>{cp.name}</h4>
                      {[['Return', `${cp.expectedReturn}% p.a.`], ['Risk', cp.riskLevel], ['Liquidity', cp.liquidity], ['Horizon', cp.timeHorizon], ['Min. Invest', formatPKR(cp.minInvestment)]].map(([l, v]) => (
                        <div key={l} className="compare-row"><span className="clabel">{l}</span><span className="cval" style={{ textTransform: 'capitalize' }}>{v}</span></div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '76px' }}>
            <div className="detail-card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--primary)', lineHeight: 1 }}>{product.expectedReturn}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Annual Expected Return</div>
              <button className={`btn btn-full add-btn ${added ? 'added' : 'btn-primary'}`} onClick={handleAdd} disabled={added}>
                {added ? '✓ Added to Portfolio' : '+ Add to Portfolio'}
              </button>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Min. Investment: {formatPKR(product.minInvestment)}</div>
            </div>
            <div className="detail-card">
              <h3>Key Facts</h3>
              {[['Risk', <RiskBadge riskLevel={product.riskLevel} />], ['Liquidity', product.liquidity], ['Time Horizon', product.timeHorizon], ['Category', product.category]].map(([l, v]) => (
                <div key={l} className="stat-row" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--surface-3)', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// USER PROFILE PAGE
function UserProfilePage({ products, setPage }) {
  const { profile, updateProfile, getRecommendations } = useContext(UserProfileContext);
  const [form, setForm] = useState(profile || { riskTolerance: '', investmentHorizon: '', monthlyCapacity: '', liquidityPreference: '', investmentGoal: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.riskTolerance) e.riskTolerance = 'Please select a risk tolerance';
    if (!form.investmentHorizon) e.investmentHorizon = 'Please select an investment horizon';
    if (!form.monthlyCapacity || form.monthlyCapacity < 1000) e.monthlyCapacity = 'Minimum investment capacity is PKR 1,000';
    if (!form.liquidityPreference) e.liquidityPreference = 'Please select a liquidity preference';
    if (!form.investmentGoal) e.investmentGoal = 'Please select an investment goal';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    updateProfile({ ...form, monthlyCapacity: parseInt(form.monthlyCapacity) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const matchCount = products.length > 0 && form.riskTolerance && form.investmentHorizon && form.monthlyCapacity && form.liquidityPreference
    ? getRecommendations(products).length : null;

  const RadioGroup = ({ field, options }) => (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt.value} className={`radio-item ${form[field] === opt.value ? 'selected' : ''}`}>
          <input type="radio" name={field} value={opt.value} checked={form[field] === opt.value} onChange={() => { setForm(f => ({ ...f, [field]: opt.value })); setErrors(e => ({ ...e, [field]: undefined })); }} />
          <div className="radio-item-content"><h4>{opt.label}</h4>{opt.desc && <p>{opt.desc}</p>}</div>
        </label>
      ))}
    </div>
  );

  return (
    <div className="page fade-in">
      <div style={{ background: 'var(--primary)', padding: '2rem', color: 'white' }}>
        <div className="container-narrow" style={{ padding: '0 1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Financial Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.4rem' }}>Tell us about your investment goals so we can personalize your recommendations.</p>
        </div>
      </div>
      <div className="container-narrow">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <div className="profile-form-section">
              <h3>Risk Tolerance</h3>
              <RadioGroup field="riskTolerance" options={[
                { value: 'conservative', label: '🛡 Conservative', desc: 'I prefer to protect my capital. Low risk only.' },
                { value: 'moderate', label: '⚖ Moderate', desc: 'I can handle some risk for better returns.' },
                { value: 'aggressive', label: '🚀 Aggressive', desc: 'I pursue maximum returns and accept high volatility.' }
              ]} />
              {errors.riskTolerance && <p className="form-error">{errors.riskTolerance}</p>}
            </div>

            <div className="profile-form-section">
              <h3>Investment Horizon</h3>
              <RadioGroup field="investmentHorizon" options={[
                { value: 'short', label: '⚡ Short Term (1–2 years)', desc: 'I need access to funds soon.' },
                { value: 'medium', label: '📅 Medium Term (3–5 years)', desc: 'I can invest for a few years.' },
                { value: 'long', label: '🌱 Long Term (5+ years)', desc: 'I am investing for the distant future.' }
              ]} />
              {errors.investmentHorizon && <p className="form-error">{errors.investmentHorizon}</p>}
            </div>

            <div className="profile-form-section">
              <h3>Liquidity Preference</h3>
              <RadioGroup field="liquidityPreference" options={[
                { value: 'easy', label: '💧 Need Quick Access', desc: 'I may need to withdraw funds on short notice.' },
                { value: 'moderate', label: '🔄 Some Flexibility', desc: 'I can wait a few months if needed.' },
                { value: 'locked', label: '🔒 Can Lock Funds', desc: 'I can commit funds for the full duration.' }
              ]} />
              {errors.liquidityPreference && <p className="form-error">{errors.liquidityPreference}</p>}
            </div>

            <div className="profile-form-section">
              <h3>Monthly Investment Capacity & Goal</h3>
              <div className="form-row">
                <label className="form-label">Monthly Investment Capacity (PKR)</label>
                <input type="number" step="1000" min="1000" placeholder="e.g. 50000"
                  value={form.monthlyCapacity}
                  onChange={e => { setForm(f => ({ ...f, monthlyCapacity: e.target.value })); setErrors(er => ({ ...er, monthlyCapacity: undefined })); }} />
                {errors.monthlyCapacity && <p className="form-error">{errors.monthlyCapacity}</p>}
              </div>
              <div className="form-row">
                <label className="form-label">Primary Investment Goal</label>
                <select value={form.investmentGoal} onChange={e => { setForm(f => ({ ...f, investmentGoal: e.target.value })); setErrors(er => ({ ...er, investmentGoal: undefined })); }}>
                  <option value="">Select goal…</option>
                  <option value="wealth">Wealth Building</option>
                  <option value="retirement">Retirement</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="purchase">Specific Purchase</option>
                </select>
                {errors.investmentGoal && <p className="form-error">{errors.investmentGoal}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
                {saved ? '✓ Profile Saved!' : 'Save Profile & Get Recommendations'}
              </button>
              {profile && <button className="btn btn-secondary" onClick={() => setPage('recommendations')}>View Recommendations →</button>}
            </div>
          </div>

          {/* Profile Summary Sidebar */}
          <div>
            <div className="profile-summary">
              <h3>Your Profile</h3>
              {[['Risk Tolerance', form.riskTolerance || '—'], ['Investment Horizon', form.investmentHorizon || '—'], ['Monthly Capacity', form.monthlyCapacity ? formatPKR(form.monthlyCapacity) : '—'], ['Liquidity', form.liquidityPreference || '—'], ['Goal', form.investmentGoal || '—']].map(([k, v]) => (
                <div key={k} className="summary-item"><span className="summary-key">{k}</span><span className="summary-val" style={{ textTransform: 'capitalize' }}>{v}</span></div>
              ))}
              {matchCount !== null && (
                <div className="match-count">🎯 {matchCount} products match your profile</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PORTFOLIO PAGE
function PortfolioPage({ setPage }) {
  const { portfolio, removeFromPortfolio, updateAllocation, calculatePortfolioStats } = useContext(PortfolioContext);
  const stats = calculatePortfolioStats();
  return (
    <div className="page fade-in">
      <div style={{ background: 'var(--primary)', padding: '2rem', color: 'white' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>My Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.4rem' }}>Manage your investment allocations and track portfolio performance.</p>
        </div>
      </div>
      <div className="container">
        {portfolio.items.length === 0
          ? <div className="empty-state" style={{ marginTop: '3rem' }}>
            <span className="emoji">📂</span>
            <h3>Your portfolio is empty</h3>
            <p>Browse financial products and add them to track your investments.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setPage('products')}>Browse Products</button>
          </div>
          : <div className="portfolio-layout" style={{ marginTop: '2rem' }}>
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Holdings</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Edit amounts then click away to update</span>
              </div>
              {portfolio.items.map(item => (
                <PortfolioItem key={item.id} item={item} onRemove={removeFromPortfolio} onUpdateAmount={updateAllocation} />
              ))}
            </div>
            <PortfolioSummary stats={stats} items={portfolio.items} />
          </div>}
      </div>
    </div>
  );
}

// RECOMMENDATIONS PAGE
function RecommendationsPage({ products, portfolio, onAddToPortfolio, setPage }) {
  const { profile, getRecommendations, isProfileComplete } = useContext(UserProfileContext);
  if (!isProfileComplete()) return (
    <div className="page fade-in">
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Profile Required</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Complete your financial profile to get personalized product recommendations.</p>
        <button className="btn btn-primary" onClick={() => setPage('profile')}>Create My Profile →</button>
      </div>
    </div>
  );
  const recommendations = getRecommendations(products);
  return (
    <div className="page fade-in">
      <div className="rec-header" style={{ margin: '2rem 1.5rem 0', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2>Personalized Recommendations</h2>
        <p>Based on your {profile.riskTolerance} risk tolerance · {profile.investmentHorizon}-term horizon · {formatPKR(profile.monthlyCapacity)} capacity</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>🎯 {recommendations.length} matches</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Goal: {profile.investmentGoal}</span>
        </div>
      </div>
      <div className="container">
        <RecommendationList recommendations={recommendations} profile={profile} onAddToPortfolio={onAddToPortfolio} portfolio={portfolio} onViewDetail={(id) => setPage('detail', id)} />
      </div>
    </div>
  );
}

// NOT FOUND
function NotFoundPage({ setPage }) {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or the product ID is invalid.</p>
      <button className="btn btn-primary" onClick={() => setPage('home')}>Go Home</button>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, portfolioCount }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'profile', label: 'My Profile' },
    { id: 'portfolio', label: `Portfolio${portfolioCount > 0 ? '' : ''}` },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-brand">Fin<span>Nest</span></div>
      <div className="navbar-links">
        {links.map(l => (
          <button key={l.id} className={`nav-link ${page === l.id ? 'active' : ''}`} onClick={() => setPage(l.id)}>
            {l.label}{l.id === 'portfolio' && portfolioCount > 0 && <span className="portfolio-badge">{portfolioCount}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--surface-3)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading financial products…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
function AppContent() {
  const [page, setPageRaw] = useState('home');
  const [pageParam, setPageParam] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { portfolio, addToPortfolio } = useContext(PortfolioContext);

  const setPage = (p, param = null) => { setPageRaw(p); setPageParam(param); window.scrollTo(0, 0); };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(r => r.json())
      .then(data => { setProducts(data.map(transformToFinancialProduct)); setLoading(false); })
      .catch(() => { setError('Failed to load products. Please refresh.'); setLoading(false); });
  }, []);

  if (loading) return <><Navbar page={page} setPage={setPage} portfolioCount={portfolio.items.length} /><LoadingSpinner /></>;
  if (error) return <><Navbar page={page} setPage={setPage} portfolioCount={portfolio.items.length} /><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--risk-high)' }}>{error}</div></>;

  let content;
  if (page === 'home') content = <HomePage products={products} setPage={setPage} onAddToPortfolio={addToPortfolio} portfolio={portfolio} />;
  else if (page === 'products') content = <ProductListingPage products={products} initialCategory={pageParam} portfolio={portfolio} onAddToPortfolio={addToPortfolio} setPage={setPage} />;
  else if (page === 'detail') {
    const product = products.find(p => p.id === parseInt(pageParam));
    content = product ? <ProductDetailPage product={product} products={products} portfolio={portfolio} onAddToPortfolio={addToPortfolio} setPage={setPage} /> : <NotFoundPage setPage={setPage} />;
  }
  else if (page === 'profile') content = <UserProfilePage products={products} setPage={setPage} />;
  else if (page === 'portfolio') content = <PortfolioPage setPage={setPage} />;
  else if (page === 'recommendations') content = <RecommendationsPage products={products} portfolio={portfolio} onAddToPortfolio={addToPortfolio} setPage={setPage} />;
  else content = <NotFoundPage setPage={setPage} />;

  return (
    <>
      <Navbar page={page} setPage={setPage} portfolioCount={portfolio.items.length} />
      {content}
    </>
  );
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <UserProfileProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </UserProfileProvider>
    </>
  );
}
