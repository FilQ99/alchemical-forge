import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// KLUCZOWA POPRAWKA: Upewnij się, że ta linia istnieje i jest poprawna.
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);