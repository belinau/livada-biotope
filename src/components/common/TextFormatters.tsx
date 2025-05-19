import { ReactNode } from 'react';

/**
 * Component for rendering strong text
 */
export function StrongText({ children }: { children: ReactNode }) {
  return <strong>{children}</strong>;
}

/**
 * Component for rendering emphasized text
 */
export function EmphasizedText({ children }: { children: ReactNode }) {
  return <em>{children}</em>;
}
