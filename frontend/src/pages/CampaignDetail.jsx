import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCampaign } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getCampaign(id);
        if (mounted) setCampaign(data);
      } catch (err) {
        console.error(err);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="center"><LoadingSpinner /></div>;
  if (!campaign) return <div className="center">Campaign not found</div>;

  return (
    <div className="page container">
      <h2>{campaign.title}</h2>
      <p>{campaign.description}</p>
      <div><strong>Goal:</strong> {campaign.goal_amount ?? 'N/A'}</div>
      <div style={{ marginTop: 8 }}>
        <Link to={`/donate/${id}`} className="btn-primary">Donate Now</Link>
      </div>
    </div>
  );
}
