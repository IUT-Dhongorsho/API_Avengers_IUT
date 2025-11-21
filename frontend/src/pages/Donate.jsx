import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampaign, createPledge } from '../services/api';
import DonationForm from '../components/DonationForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Donate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCampaign(id);
        setCampaign(data);
      } catch (err) {
        setError('Failed to load campaign');
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  async function onSubmit(form) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createPledge({
        campaignId: id,
        amount: form.amount,
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        note: form.note
      });
      // Expected server response: { pledgeId, status }
      navigate(`/campaign/${id}?pledge=${res.pledgeId}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create pledge');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="center"><LoadingSpinner /></div>;
  if (!campaign) return <div className="center">Campaign not found</div>;

  return (
    <div className="page container">
      <h2>Donate to: {campaign.title}</h2>
      <p>{campaign.description}</p>
      {error && <div className="alert-error">{error}</div>}
      <DonationForm defaultAmount={campaign.suggestedAmount || ''} onSubmit={onSubmit} submitting={submitting} />
      <small>Note: Payment is finalized when payment provider webhook confirms. Duplicate webhook handling is done server-side.</small>
    </div>
  );
}
