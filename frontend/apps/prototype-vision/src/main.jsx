// Sentry must be initialized FIRST
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './utils/devToken' // DEV: Auto-set token
import ErrorBoundary from './components/ErrorBoundary'

console.log('🚀 System Boot: Starting main.jsx');

try {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>,
    );
    console.log('✨ System Boot: Render trigger successful');
} catch (err) {
    console.error('💥 System Boot: FAILED to render!', err);
}
