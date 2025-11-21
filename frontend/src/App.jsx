import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CampaignDetail from './pages/CampaignDetail';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ paddingTop: 72 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
