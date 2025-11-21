import React from 'react';
import { Link } from 'react-router-dom';

export default function CampaignCard({ c }) {
  return (
    <div className="campaign-card">
      <h3>{c.title}</h3>
      <p>{c.description?.slice(0, 120)}{c.description?.length > 120 ? '...' : ''}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/campaign/${c.id}`} className="btn-link">Details</Link>
        <Link to={`/donate/${c.id}`} className="btn-primary">Donate</Link>
      </div>
    </div>
  );
}
