import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="center"><LoadingSpinner /></div>;

  return (
    <div className="page container">
      <h1>Campaigns</h1>
      <div className="campaigns-grid">
        {campaigns.map(c => <CampaignCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
