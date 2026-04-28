import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MarketDataProvider } from './lib/MarketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MarketDataProvider>
      <App />
    </MarketDataProvider>
  </StrictMode>,
);
