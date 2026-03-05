import React, { useEffect, useState } from 'react';

// simple business-logic component that fetches recent activities from an API
export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // replace the URL with your real endpoint
        const res = await fetch('/api/recent-activities');
        if (!res.ok) throw new Error(`status=${res.status}`);
        const data = await res.json();
        if (!cancelled) setActivities(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading activities…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (activities.length === 0) return <p>No recent activity</p>;

  return (
    <div className="dashboard-grid">
      {activities.map((act) => (
        <div key={act.id} className="stat-card" style={{ padding: '1rem' }}>
          <div className="title" style={{ textTransform: 'capitalize' }}>{act.title}</div>
          <div className="value" style={{ fontSize: '16px' }}>{act.status}</div>
        </div>
      ))}
    </div>
  );
}
