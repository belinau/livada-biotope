import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { SensorProvider } from './context/SensorContext';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ContentCollectionPage from './pages/ContentCollectionPage';
import BiodiversityPage from './pages/BiodiversityPage';
import GalleryPage from './pages/GalleryPage';
import CalendarPage from './pages/CalendarPage';
import MemoryGamePage from './pages/MemoryGamePage';
import FundingLogos from './components/FundingLogos';
import { Navbar } from "./components/ui/resizable-navbar/Navbar";
import { NavBody } from "./components/ui/resizable-navbar/NavBody";
import { NavItems } from "./components/ui/resizable-navbar/NavItems";
import { MobileNav } from "./components/ui/resizable-navbar/MobileNav";
import { NavbarLogo } from "./components/ui/resizable-navbar/NavbarLogo";
import { NavbarButton } from "./components/ui/resizable-navbar/NavbarButton";
import { MobileNavHeader } from "./components/ui/resizable-navbar/MobileNavHeader";
import { MobileNavToggle } from "./components/ui/resizable-navbar/MobileNavToggle";
import { MobileNavMenu } from "./components/ui/resizable-navbar/MobileNavMenu";

function App() {
    const { t, setLanguage, language } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                primaryColor: '#4a7c59',
                primaryTextColor: '#1a1f1a',
                primaryBorderColor: '#4a7c59',
                lineColor: '#4a7c59',
                secondaryColor: '#6aa87a',
                tertiaryColor: '#e8f5e9'
            }
        });
    }, []);

    const pages = [
        { path: '/', label: t('navHome'), element: <HomePage /> },
        { path: '/prepletanja', label: t('navProjects'), element: <ProjectsPage /> },
        { path: '/zapisi', label: t('navPosts'), element: <ContentCollectionPage t={t} title={t('navPosts')} contentPath="content/posts" /> },
        { path: '/utelesenja', label: t('navPractices'), element: <ContentCollectionPage t={t} title={t('navPractices')} contentPath="content/practices" /> },
        { path: '/biodiverziteta', label: t('navBiodiversity'), element: <BiodiversityPage /> },
        { path: '/galerija', label: t('navGallery'), element: <GalleryPage /> },
        { path: '/koledar', label: t('navCalendar'), element: <CalendarPage /> },
        { path: '/spomin', label: t('navMemoryGame'), element: <MemoryGamePage /> },
      ];
      
    return (
        <div className="relative flex flex-col min-h-screen">
          <Navbar className="sticky top-0 z-50">
            <NavBody>
              <NavbarLogo />
              <NavItems items={pages} />
              <div className="flex items-center space-x-1">
                <NavbarButton onClick={() => setLanguage('sl')} className={`text-accent px-3 py-2 font-semibold transition-all duration-300 rounded-lg text-interactive hover:bg-primary/10 ${language === 'sl' ? 'text-primary bg-primary/5 shadow-sm' : 'text-text-muted hover:text-primary'}`}>SL</NavbarButton>
                <NavbarButton onClick={() => setLanguage('en')} className={`text-accent px-3 py-2 font-semibold transition-all duration-300 rounded-lg text-interactive hover:bg-primary/10 ${language === 'en' ? 'text-primary bg-primary/5 shadow-sm' : 'text-text-muted hover:text-primary'}`}>EN</NavbarButton>
              </div>
            </NavBody>

            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
              </MobileNavHeader>

              <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                {pages.map((item, idx) => (
                  <NavLink
                    key={`mobile-link-${idx}`}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `nav-text block px-4 py-3 rounded-lg text-base transition-all duration-300 text-sage ${isActive ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary font-semibold border border-primary/20' : 'hover:bg-bg-main/80 hover:text-primary'}`}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="flex justify-center space-x-3 pt-4 border-t border-border-color/50 mt-4">
                  <NavbarButton onClick={() => { setLanguage('sl'); setIsMobileMenuOpen(false); }} className={`text-accent px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${language === 'sl' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-muted hover:text-primary hover:bg-bg-main/80'}`}>Slovenščina</NavbarButton>
                  <NavbarButton onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`text-accent px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${language === 'en' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-muted hover:text-primary hover:bg-bg-main/80'}`}>English</NavbarButton>
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Routes location={location}> 
                                {pages.map(page => ( <Route key={page.path} path={page.path} element={page.element} /> ))}
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </main>
                <FundingLogos />
                <footer className="py-8 text-center bg-gradient-to-t from-bg-main/90 to-transparent backdrop-blur-sm border-t border-border-color/30">
                    <div className="container mx-auto text-body text-text-muted">{t('footerText')}</div>
                </footer>
            </div> 
    );
}

export default function WrappedApp() {
    return (
        <LanguageProvider>
            <SensorProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </SensorProvider>
        </LanguageProvider>
    );
}
