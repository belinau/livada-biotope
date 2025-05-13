import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useTranslations from '../../hooks/useTranslations';
import { useLanguage } from '../../contexts/LanguageContext';

export const Navbar = () => {
  const { t } = useTranslations();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: t('Navbar.home') },
    { href: '/biodiversity', label: t('Navbar.biodiversity') },
    { href: '/projects', label: t('Navbar.projects') },
    { href: '/instructables', label: t('Navbar.instructables') },
    { href: '/ecofeminism', label: t('Navbar.ecofeminism') },
    { href: '/events', label: t('Navbar.events') },
    { href: '/galleries', label: t('Navbar.galleries') },
    { href: '/about', label: t('Navbar.about') },
    { href: '/contact', label: t('Navbar.contact', 'Contact') },
    { href: '/blog', label: t('Navbar.blog', 'Blog') },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="no-underline">
                <Image src="/images/livada-bio-logo-new.svg" alt="livada.bio" width={150} height={40} />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-livada-green"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={() => {
                const newLanguage = language === 'sl' ? 'en' : 'sl';
                setLanguage(newLanguage);
              }}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-livada-green hover:bg-livada-green/90"
            >
              {language === 'sl' ? 'EN' : 'SL'}
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-livada-green"
              onClick={toggleMenu}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              const newLanguage = language === 'sl' ? 'en' : 'sl';
              setLanguage(newLanguage);
              toggleMenu();
            }}
            className="w-full text-left px-3 py-2 text-base font-medium text-white bg-livada-green hover:bg-livada-green/90 rounded-md mt-2"
          >
            {language === 'sl' ? 'English' : 'Slovenščina'}
          </button>
        </div>
      </div>
    </nav>
  );
};
