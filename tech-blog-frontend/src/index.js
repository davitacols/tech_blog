import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create the root element for the React application
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the App component wrapped in StrictMode for highlighting potential problems
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance and log results or send to analytics endpoint
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

// Optional: Register service worker for offline capabilities and faster load times
// Learn more about service workers: https://bit.ly/CRA-PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}
