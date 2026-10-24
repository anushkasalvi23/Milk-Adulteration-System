import React, { useEffect } from 'react';
import Layout from './components/Layout';
import { setTokenGetter } from './api';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, AuthenticateWithRedirectCallback, useAuth } from '@clerk/clerk-react';
import AuthPage from './pages/AuthPage';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import DataExplorer from './pages/DataExplorer';

function App() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
            <SignedOut>
              <Landing onStart={() => navigate('/sign-up')} onSignIn={() => navigate('/login')} />
            </SignedOut>
          </>
        }
      />
      <Route path="/login/*" element={<AuthPage mode="sign-in" />} />
      <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/data" element={<DataExplorer />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
