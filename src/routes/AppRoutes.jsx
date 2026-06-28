import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login/Login';
import RoleSelection from '../pages/RoleSelection/RoleSelection';
import Dashboard from '../pages/Dashboard/Dashboard';
import Processing from '../pages/Processing/Processing';
import Results from '../pages/Results/Results';
import Evaluation from '../pages/Evaluation/Evaluation';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/evaluation" element={<Evaluation />} />
        </Route>

        {/* Catch-all redirect to Dashboard (guarded by layout login check) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
