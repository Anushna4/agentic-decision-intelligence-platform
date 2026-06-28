import React from 'react';
import { PlatformProvider } from './context/PlatformContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <PlatformProvider>
      <AppRoutes />
    </PlatformProvider>
  );
}

export default App;
