import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">CareForAll</Link>
        <nav>
          <Link to="/">Campaigns</Link>
          <Link to="/admin">Admin</Link>
          {token ? (
            <button className="btn-link" onClick={onLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
