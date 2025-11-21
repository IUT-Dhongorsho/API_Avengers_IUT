import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/common.css';
import './styles/header.css';
import './styles/forms.css';
import './styles/admin.css';

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
