import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);