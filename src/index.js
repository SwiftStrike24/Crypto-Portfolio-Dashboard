// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/tailwind.css';
import { Analytics } from '@vercel/analytics'; // Import the Analytics component

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Analytics /> {/* Add the Analytics component here */}
  </React.StrictMode>,
  document.getElementById('root')
);
