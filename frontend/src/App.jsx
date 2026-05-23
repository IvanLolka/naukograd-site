import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import CourseCatalog from './pages/CourseCatalog';
import EventsCatalog from './pages/EventsCatalog';
import TestPage from './pages/TestPage';
import AuthPage from './pages/AuthPage';
import RegistPage from './pages/RegistPage';

function AppContent() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/CourseCatalog" element={<CourseCatalog />} />
          <Route path="/EventsCatalog" element={<EventsCatalog />} />
          <Route path="/AuthPage" element={<AuthPage />} />
          <Route path="/RegistPage" element={<RegistPage />} />
          <Route path="/TestPage" element={<TestPage />} />
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;