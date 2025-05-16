import '@mui/material/Grid';

declare module '@mui/material/Grid' {
  interface GridPropsVariantOverrides {
    container: true;
    item: true;
  }
  
  interface GridPropsSizeOverrides {
    xs: number | boolean | 'auto';
    sm: number | boolean | 'auto';
    md: number | boolean | 'auto';
    lg: number | boolean | 'auto';
    xl: number | boolean | 'auto';
  }
  
  interface GridProps {
    container?: boolean;
    item?: boolean;
    xs?: number | boolean | 'auto';
    sm?: number | boolean | 'auto';
    md?: number | boolean | 'auto';
    lg?: number | boolean | 'auto';
    xl?: number | boolean | 'auto';
    disableEqualOverflow?: boolean;
  }
}
