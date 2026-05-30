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
import SetNewPasswordPage from './pages/SetNewPasswordPage';
import Error404Page from './pages/Error404Page';
import BookingPage from './pages/BookingPage';
import PersonalAccount from './pages/PersonalAccount';
import PaymentPage from './pages/PaymentPage';
import AdminView from './pages/AdminView';
import AdminRedact from './pages/AdminRedact';

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
          <Route path="/SetNewPasswordPage" element={<SetNewPasswordPage />} />
          <Route path="/BookingPage" element={<BookingPage />} />
          <Route path="/PersonalAccount" element={<PersonalAccount />} />
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/AdminView" element={<AdminView />} />
          <Route path="/AdminRedact" element={<AdminRedact />} />
          <Route path="*" element={<Error404Page />} />
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