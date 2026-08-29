import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = [22, 35, 28, 41, 19, 55, 38, 62, 44, 70, 52, 83, 68, 91];
  const days = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  const max = Math.max(...data);
  const achs = ['🔍', '⚡', '📄', '🏆', '💎', '🔓', '🌟', '🛡️', '🚀', '🎯', '🔥', '✨', '🔒', '🔒', '🔒'];

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em' }}>{getGreeting()}, {firstName} 👋</h1>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-4)', marginTop: '4px' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Your streak: 14 days 🔥</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-ghost" style={{ fontSize: '13px', padding: '9px 16px' }}>Download app</button>
          <button className="btn-primary" style={{ fontSize: '13px', padding: '9px 16px' }}>Open FileFlow</button>
        </div>
      </div>

      <div className="kpi-grid anim-fade-up">
        <div className="kpi"><div className="kpi-l">Total Searches</div><div className="kpi-v gold-text">4,821</div><div className="kpi-d">↑ 12% this week</div></div>
        <div className="kpi"><div className="kpi-l">Files Indexed</div><div className="kpi-v" style={{ color: 'var(--purple-3)' }}>18,340</div><div className="kpi-d">↑ 240 new files</div></div>
        <div className="kpi"><div className="kpi-l">Time Saved (est.)</div><div className="kpi-v" style={{ color: 'var(--green)' }}>47h</div><div className="kpi-d">vs manual search</div></div>
        <div className="kpi"><div className="kpi-l">Achievements</div><div className="kpi-v" style={{ color: 'var(--gold)' }}>12/30</div><div className="kpi-d">3 unlocked this week</div></div>
      </div>

      <div className="dash-grid anim-fade-up">
        <div className="widget">
          <div className="widget-title">Search Activity <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)', fontWeight: 400 }}>Last 14 days</span></div>
          <div className="chart-area">
            {data.map((v, i) => (
              <div 
                key={i} 
                className={`chart-bar ${i === data.length - 1 ? 'today' : ''}`} 
                style={{ height: `${(v / max) * 100}%` }} 
                title={`${v} searches`}
              />
            ))}
          </div>
          <div className="chart-labels">
            {days.map((d, i) => (
              <div key={i} className="chart-label">{d}</div>
            ))}
          </div>
        </div>
        <div className="widget">
          <div className="widget-title">Achievements <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-4)', fontWeight: 400 }}><Link to="/achievements" style={{ color: 'var(--gold)', textDecoration: 'none' }}>View all →</Link></span></div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {achs.map((a, i) => (
              <div 
                key={i}
                style={{ width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid var(--border)', background: 'var(--bg-3)', cursor: 'pointer', transition: 'transform .2s', opacity: i >= 12 ? 0.25 : 1, filter: i >= 12 ? 'grayscale(1)' : 'none' }}
                title={i < 12 ? 'Unlocked!' : 'Locked'}
                onMouseEnter={(e) => { if (i < 12) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              >
                {a}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontSize: '13px', color: 'var(--text-3)' }}>12 of 30 earned &nbsp;·&nbsp; <span style={{ color: 'var(--gold)' }}>3 new this week</span></div>
          <div style={{ marginTop: '10px', height: '6px', background: 'var(--bg-3)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: '40%', background: 'linear-gradient(90deg, var(--gold), var(--gold-2))', borderRadius: '3px' }}></div></div>
        </div>
      </div>

      <div className="dash-2col anim-fade-up">
        <div className="widget">
          <div className="widget-title">Recent Searches</div>
          <div className="sh-item"><Search size={14} color="var(--purple-3)" /><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)' }}>quarterly revenue forecast</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>4 results · 2m ago</div></div>
          <div className="sh-item"><Search size={14} color="var(--purple-3)" /><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)' }}>indemnification clause</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>12 results · 1h ago</div></div>
          <div className="sh-item"><Search size={14} color="var(--purple-3)" /><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)' }}>project alpha timeline</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>7 results · 3h ago</div></div>
          <div className="sh-item"><Search size={14} color="var(--purple-3)" /><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)' }}>board meeting notes march</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>3 results · Yesterday</div></div>
        </div>
        <div className="widget">
          <div className="widget-title">Recently Opened Files</div>
          <div className="file-row"><div className="ficon" style={{ background: 'rgba(124,58,237,.15)', color: 'var(--purple-3)' }}>DOCX</div><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Q4_Financial_Report_2024.docx</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>2m ago</div></div>
          <div className="file-row"><div className="ficon" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>XLSX</div><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Revenue_Tracker_v3.xlsx</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>1h ago</div></div>
          <div className="file-row"><div className="ficon" style={{ background: 'rgba(239,68,68,.1)', color: 'var(--red)' }}>PDF</div><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Board_Presentation_Nov.pdf</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>3h ago</div></div>
          <div className="file-row"><div className="ficon" style={{ background: 'rgba(245,166,35,.1)', color: 'var(--gold)' }}>PDF</div><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Contract_Acme_Corp_2026.pdf</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>Yesterday</div></div>
          <div className="file-row"><div className="ficon" style={{ background: 'rgba(99,99,99,.15)', color: 'var(--text-3)' }}>TXT</div><div style={{ flex: 1, fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>meeting_notes_board_march.txt</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)' }}>2d ago</div></div>
        </div>
      </div>
    </>
  );
}
