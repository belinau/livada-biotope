import { forwardRef } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

type LinkProps = Omit<MuiLinkProps, 'href'> & {
  href: string;
  linkAs?: NextLinkProps['as'];
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({
  href,
  linkAs,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  ...rest
}, ref) => {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      ref={ref}
      {...rest}
    />
  );
});

Link.displayName = 'Link';

export default Link;
