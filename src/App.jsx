import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './ContentContext.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AshtheBuilder" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}