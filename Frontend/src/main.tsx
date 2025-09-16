import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  // Show a helpful message instead of crashing
  createRoot(document.getElementById("root")!).render(
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ Configuration Required</h1>
      <p style={{ marginBottom: '16px', maxWidth: '500px' }}>
        Please create a <code>.env.local</code> file in your project root and add your Clerk publishable key:
      </p>
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '16px', 
        borderRadius: '8px', 
        fontFamily: 'monospace',
        marginBottom: '16px'
      }}>
        VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
      </div>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Get your key from: <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Clerk Dashboard</a>
      </p>
    </div>
  );
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/"
    signInFallbackRedirectUrl="/"
    signUpFallbackRedirectUrl="/"
  >
    <App />
  </ClerkProvider>
);
