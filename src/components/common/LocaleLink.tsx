import { usePathname } from 'next/navigation';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { locales, defaultLocale } from '@/config';

interface LocaleLinkProps extends Omit<NextLinkProps, 'href' | 'as'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  locale?: string | false;
  activeClassName?: string;
  exact?: boolean;
}

const LocaleLink: React.FC<LocaleLinkProps> = ({
  href,
  children,
  className = '',
  locale,
  activeClassName = '',
  exact = false,
  ...props
}) => {
  const pathname = usePathname();
  
  // Get the current locale from the pathname
  const currentPathLocale = pathname?.split('/')[1];
  const currentLocale = locales.includes(currentPathLocale as any) 
    ? currentPathLocale 
    : defaultLocale;
  
  // Determine the target locale
  const targetLocale = locale === false ? '' : locale || currentLocale;
  
  // Handle external URLs
  if (typeof href === 'string' && (href.startsWith('http') || href.startsWith('//'))) {
    return (
      <a 
        href={href} 
        className={className} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props as any}
      >
        {children}
      </a>
    );
  }
  
  // Handle internal links
  let path = href;
  
  // Add locale prefix if needed
  if (targetLocale && targetLocale !== defaultLocale) {
    path = `/${targetLocale}${path === '/' ? '' : path}`;
  }
  
  // Add active class if the current path matches the link
  const isActive = exact 
    ? pathname === path || pathname === `${path}/`
    : pathname?.startsWith(path) || pathname?.startsWith(`${path}/`);
  
  const linkClassName = [
    className,
    isActive ? activeClassName : ''
  ].filter(Boolean).join(' ') || undefined;
  
  return (
    <NextLink 
      href={path} 
      className={linkClassName}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default LocaleLink;
