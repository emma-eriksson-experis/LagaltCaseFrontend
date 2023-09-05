import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const config = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri:
  window.location.origin + '/silent-check-sso.html',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
      <ReactKeycloakProvider authClient={keycloak} initOptions={config}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
      </ReactKeycloakProvider>
  );
