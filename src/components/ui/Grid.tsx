import React, { ReactNode, forwardRef } from 'react';
import { Box, BoxProps, styled, Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';

export interface GridProps extends Omit<BoxProps, 'display'> {
  children: ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string | { xs?: number | string; sm?: number | string; md?: number | string; lg?: number | string; xl?: number | string };
  rowGap?: number | string | { xs?: number | string; sm?: number | string; md?: number | string; lg?: number | string; xl?: number | string };
  columnGap?: number | string | { xs?: number | string; sm?: number | string; md?: number | string; lg?: number | string; xl?: number | string };
  // Explicitly exclude MUI Grid props
  container?: never;
  item?: never;
  xs?: never;
  sm?: never;
  md?: never;
  lg?: never;
  xl?: never;
  disableEqualOverflow?: never;
}

const ResponsiveGrid = styled(Box, {
  shouldForwardProp: (prop) => !['columns', 'gap', 'rowGap', 'columnGap', 'container', 'item', 'xs', 'sm', 'md', 'lg', 'xl', 'disableEqualOverflow'].includes(prop as string),
})<GridProps>(({ theme, columns = 1, gap, rowGap, columnGap }) => {
  // Handle responsive columns
  const getColumns = (breakpoint?: string) => {
    if (typeof columns === 'number') {
      return breakpoint ? undefined : columns;
    }
    return breakpoint ? (columns as any)[breakpoint] : undefined;
  };

  // Handle responsive gaps
  const getGap = (value: any, breakpoint?: string) => {
    if (!value) return undefined;
    if (typeof value === 'number' || typeof value === 'string') {
      return breakpoint ? undefined : value;
    }
    return breakpoint ? (value as any)[breakpoint] : undefined;
  };

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${getColumns() || 1}, 1fr)`,
    gap: getGap(gap),
    rowGap: getGap(rowGap),
    columnGap: getGap(columnGap),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: `repeat(${getColumns('sm') || getColumns() || 1}, 1fr)`,
      gap: getGap(gap, 'sm') || getGap(gap),
      rowGap: getGap(rowGap, 'sm') || getGap(rowGap),
      columnGap: getGap(columnGap, 'sm') || getGap(columnGap),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: `repeat(${getColumns('md') || getColumns('sm') || getColumns() || 1}, 1fr)`,
      gap: getGap(gap, 'md') || getGap(gap, 'sm') || getGap(gap),
      rowGap: getGap(rowGap, 'md') || getGap(rowGap, 'sm') || getGap(rowGap),
      columnGap: getGap(columnGap, 'md') || getGap(columnGap, 'sm') || getGap(columnGap),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: `repeat(${getColumns('lg') || getColumns('md') || getColumns('sm') || getColumns() || 1}, 1fr)`,
      gap: getGap(gap, 'lg') || getGap(gap, 'md') || getGap(gap, 'sm') || getGap(gap),
      rowGap: getGap(rowGap, 'lg') || getGap(rowGap, 'md') || getGap(rowGap, 'sm') || getGap(rowGap),
      columnGap: getGap(columnGap, 'lg') || getGap(columnGap, 'md') || getGap(columnGap, 'sm') || getGap(columnGap),
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: `repeat(${getColumns('xl') || getColumns('lg') || getColumns('md') || getColumns('sm') || getColumns() || 1}, 1fr)`,
      gap: getGap(gap, 'xl') || getGap(gap, 'lg') || getGap(gap, 'md') || getGap(gap, 'sm') || getGap(gap),
      rowGap: getGap(rowGap, 'xl') || getGap(rowGap, 'lg') || getGap(rowGap, 'md') || getGap(rowGap, 'sm') || getGap(rowGap),
      columnGap: getGap(columnGap, 'xl') || getGap(columnGap, 'lg') || getGap(columnGap, 'md') || getGap(columnGap, 'sm') || getGap(columnGap),
    },
  };
});

export interface CustomGridProps extends MuiGridProps {}

const CustomGrid = forwardRef<HTMLDivElement, CustomGridProps>((props, ref) => {
  return <MuiGrid ref={ref} {...props} />;
});

CustomGrid.displayName = 'CustomGrid';

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 1,
  gap,
  rowGap,
  columnGap,
  ...props
}) => {
  // Filter out MUI Grid specific props
  const {
    container: _container,
    item: _item,
    xs: _xs,
    sm: _sm,
    md: _md,
    lg: _lg,
    xl: _xl,
    disableEqualOverflow: _disableEqualOverflow,
    ...filteredProps
  } = props;

  return (
    <ResponsiveGrid
      columns={columns}
      gap={gap}
      rowGap={rowGap}
      columnGap={columnGap}
      {...filteredProps}
    >
      {children}
    </ResponsiveGrid>
  );
};

export { CustomGrid };
export default Grid;