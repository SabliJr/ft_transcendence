import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";

// import './index.css'
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={`${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}`}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
