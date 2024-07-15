// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/tailwind.css';
import { inject } from '@vercel/analytics'; // Import the inject function
import { SpeedInsights } from '@vercel/speed-insights/react'; // Import the SpeedInsights component

// Inject the Vercel Analytics script
inject();

ReactDOM.render(
  <React.StrictMode>
    <App />
    <SpeedInsights /> {/* Add the SpeedInsights component */}
  </React.StrictMode>,
  document.getElementById('root')
);
