import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { AboutPage } from './pages/About/AboutPage';
import { ScientificProgramPage } from './pages/ScientificProgram/ScientificProgramPage';
import { CommitteePage } from './pages/Committee/CommitteePage';
import { AbstractSubmissionPage } from './pages/AbstractSubmission/AbstractSubmissionPage';
import { RegistrationPage } from './pages/Registration/RegistrationPage';
import { VenuePage } from './pages/Venue/VenuePage';
import { ContactPage } from './pages/Contact/ContactPage';
import { AdminPage } from './pages/Admin/AdminPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-[#182230] bg-[#FAF5ED] selection:bg-[#003399] selection:text-white"
      style={
        !isHomePage
          ? {
              backgroundImage: "url('/assets/images/inner_page_bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/scientific-program" element={<ScientificProgramPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/speakers" element={<CommitteePage />} />
          <Route path="/abstract-submission" element={<AbstractSubmissionPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/venue" element={<VenuePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
