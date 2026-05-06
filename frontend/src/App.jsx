import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';

function AppContent() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
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