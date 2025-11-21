import React, { useEffect, useState } from 'react';
import { adminGetCampaigns, adminGetPledges } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const [campaigns, setCampaigns] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([adminGetCampaigns(), adminGetPledges()]);
        setCampaigns(c);
        setPledges(p);
      } catch (e) {
        setErr('Failed to load admin data. Are you authenticated?');
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="center"><LoadingSpinner /></div>;
  if (err) return <div className="alert-error">{err}</div>;

  return (
    <div className="page container">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Campaigns</h3>
        <div className="campaigns-admin">
          {campaigns.map(c => (
            <div className="campaign-admin-card" key={c.id}>
              <strong>{c.title}</strong>
              <div>Goal: {c.goal_amount ?? 'N/A'}</div>
              <div>Raised: {c.raised_amount ?? 0}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Recent Pledges</h3>
        <table className="pledges-table">
          <thead>
            <tr><th>Pledge</th><th>Campaign</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {pledges.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.campaign_title || p.campaignId}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
