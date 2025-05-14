import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '../../contexts/LanguageContext';
import useTranslations from '../../hooks/useTranslations';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Box, Container, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Divider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LayoutProps {
  children: ReactNode;
}

// Mobile Menu Component with animation
const MobileMenu = () => {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    
    // Lock body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden relative z-20 p-2 bg-white rounded-md"
        aria-label="Toggle menu"
      >
        <div className="w-6 flex flex-col justify-center items-center">
          <span 
            className={`block h-0.5 w-6 bg-green-700 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
          ></span>
          <span 
            className={`block h-0.5 w-6 bg-green-700 my-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          ></span>
          <span 
            className={`block h-0.5 w-6 bg-green-700 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          ></span>
        </div>
      </button>

      {/* Fullscreen Mobile Menu */}
      <div 
        className={`fixed inset-0 z-10 bg-white/95 backdrop-blur-md flex flex-col justify-center items-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <nav className="flex flex-col space-y-6 text-center">
          <Link 
            href="/" 
            className="text-3xl font-serif text-green-800 hover:text-green-700 transition-all transform hover:scale-105 hover:translate-x-2 duration-300"
            onClick={() => setIsOpen(false)}
          >
            {t('menu.home')}
          </Link>
          <Link 
            href="/about" 
            className="text-3xl font-serif text-green-800 hover:text-green-700 transition-all transform hover:scale-105 hover:translate-x-2 duration-300"
            onClick={() => setIsOpen(false)}
          >
            {t('menu.about')}
          </Link>
          <Link 
            href="/projects" 
            className="text-3xl font-serif text-green-800 hover:text-green-700 transition-all transform hover:scale-105 hover:translate-x-2 duration-300"
            onClick={() => setIsOpen(false)}
          >
            {t('menu.projects')}
          </Link>
          <Link 
            href="/events" 
            className="text-3xl font-serif text-green-800 hover:text-green-700 transition-all transform hover:scale-105 hover:translate-x-2 duration-300"
            onClick={() => setIsOpen(false)}
          >
            {t('menu.events')}
          </Link>
          <Link 
            href="/contact" 
            className="text-3xl font-serif text-green-800 hover:text-green-700 transition-all transform hover:scale-105 hover:translate-x-2 duration-300"
            onClick={() => setIsOpen(false)}
          >
            {t('menu.contact')}
          </Link>
        </nav>
      </div>
    </>
  );
};

const StyledLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium" onClick={onClick}>
    {children}
  </Link>
);

const StyledMenuItem = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/', title: t('Navbar.home') },
    { href: '/biodiversity', title: t('Navbar.biodiversity') },
    { href: '/projects', title: t('Navbar.projects') },
    { href: '/galleries', title: t('Navbar.galleries') },
    { href: '/instructables', title: t('Navbar.instructables') },
    { href: '/ecofeminism', title: t('Navbar.ecofeminism') },
    { href: '/events', title: t('Navbar.events') },
    { href: '/about', title: t('Navbar.about') }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <Head>
        <title>{t('menu.locale') === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}</title>
        <meta name="description" content="A community-driven ecological project in Ljubljana, Slovenia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Simple gray background */}
      <div className="fixed inset-0 bg-gray-100 pointer-events-none z-0"></div>
      
      <header className="bg-white py-4 border-b border-green-300 relative z-10">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <StyledLink href="/">
              <Box component="img" src="/images/livada-bio-logo-new.svg" alt="livada.bio" sx={{ height: 40, width: 150 }} />
            </StyledLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              {menuItems.map((item) => (
                <StyledLink key={item.href} href={item.href}>
                  {item.title}
                </StyledLink>
              ))}
              
              {/* Language Switcher */}
              <LanguageSwitcher />
            </nav>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </Toolbar>
        </Container>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className={`fixed right-0 top-0 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 z-50 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="py-4 px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <StyledLink href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.title}
                    </StyledLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}

      <main className="flex-grow py-6 relative z-10">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-green-300 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {t('menu.locale') === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}
              </h3>
              <p className="text-gray-700 mb-4">
                {t('menu.locale') === 'en' 
                  ? 'A community-driven ecological project dedicated to preserving biodiversity and building drought resilience in Ljubljana, Slovenia.'
                  : 'Skupnostno vodeno ekološko projekt, posvečen ohranjanju biotske raznolikosti in izgradnji sušne odpornosti v Ljubljani, Sloveniji.'}
              </p>
              <div className="flex space-x-4">
                <a href="https://bsky.app/profile/livadabiotope.bsky.social" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 transition-colors">
                  Bluesky
                </a>
                <a href="https://www.inaturalist.org/projects/livada-biotope" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 transition-colors">
                  iNaturalist
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-700 hover:text-green-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-700 hover:text-green-700">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-700 hover:text-green-700">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-700 hover:text-green-700">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Projects</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/projects/lets-not-dry-out-the-future" className="text-gray-700 hover:text-green-700">
                    Let&apos;s Not Dry Out The Future
                  </Link>
                </li>
                <li>
                  <a href="https://www.inaturalist.org/projects/livada-biotope" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-700">
                    Biodiversity Monitoring
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Contact</h3>
              <address className="not-italic text-gray-700">
                <p className="mb-2">{t('menu.locale') === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}</p>
                <p className="mb-2">Ljubljana, Slovenia</p>
                <p className="mb-4">
                  <a href="mailto:contact@livadabiotope.si" className="hover:text-green-700">
                    contact@livadabiotope.si
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} {t('menu.locale') === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}. All rights reserved.
                </p>
              </address>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
