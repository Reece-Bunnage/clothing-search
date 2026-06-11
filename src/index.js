// ─────────────────────────────────────────────────────────────────
// src/index.js  —  THE ENTRY POINT
//
// This is the very first file React runs.
// Its only job: find the <div id="root"> in public/index.html
// and mount the <App /> component inside it.
// You should never need to change this file.
// ─────────────────────────────────────────────────────────────────

// "import" = bring code in from another file or package.
// React is the core library. ReactDOM lets React talk to the browser.
import React from 'react';
import ReactDOM from 'react-dom/client';

// Our main component (we'll build this in App.jsx)
import App from './App';

// Our global CSS styles
import './index.css';

// Find the <div id="root"> element in public/index.html
const rootElement = document.getElementById('root');

// Create a React "root" — the starting point of our app
const root = ReactDOM.createRoot(rootElement);

// Render <App /> inside that div
// React.StrictMode is a helper that warns you about potential problems
// during development. It doesn't affect the final build.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
