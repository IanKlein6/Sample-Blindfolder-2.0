// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TranslationProvider } from './TranslationContext';

import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <TranslationProvider>
        <App />
    </TranslationProvider>
  );
