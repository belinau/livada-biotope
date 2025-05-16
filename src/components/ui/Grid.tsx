import * as React from 'react';
import MuiGrid, { 
  GridProps as MuiGridProps,
  GridSpacing,
  GridDirection,
  GridWrap,
  GridSize
} from '@mui/material/Grid';

// Extend MUI Grid props to include all necessary props
type GridProps = {
  children?: React.ReactNode;
  container?: boolean;
  item?: boolean;
  spacing?: GridSpacing;
  xs?: boolean | GridSize;
  sm?: boolean | GridSize;
  md?: boolean | GridSize;
  lg?: boolean | GridSize;
  xl?: boolean | GridSize;
  direction?: GridDirection;
  wrap?: GridWrap;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  disableEqualOverflow?: boolean;
  [key: string]: any; // Allow any other props
};

// Create a simple wrapper component
const Grid = React.forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <MuiGrid ref={ref} {...props} />;
});

// Set display name for debugging
Grid.displayName = 'Grid';

export default Grid;