import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function DonationForm({ defaultAmount = '', onSubmit, submitting }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    await onSubmit({ amount: Number(amount), donorName: name, donorEmail: email, note });
  };

  return (
    <motion.form className="donation-form" onSubmit={submit} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <label>Amount (BDT)</label>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" />
      <label>Your name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)" />
      <label>Your email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <label>Note (optional)</label>
      <textarea value={note} onChange={e => setNote(e.target.value)} />
      {error && <div className="form-error">{error}</div>}
      <button className="btn-primary" disabled={submitting}>{submitting ? 'Processing...' : 'Donate'}</button>
    </motion.form>
  );
}
