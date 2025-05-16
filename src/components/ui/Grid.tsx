import * as React from 'react';
import MuiGrid, { GridProps as MuiGridProps } from '@mui/material/Grid';

// Create a simple type that allows any props
type GridProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

// Create a simple wrapper around MUI Grid
const Grid = React.forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <MuiGrid ref={ref} {...props} />;
});

// Set display name for debugging
Grid.displayName = 'Grid';

export default Grid;
