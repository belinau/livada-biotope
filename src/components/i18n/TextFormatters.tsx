import { ReactNode } from 'react';

export function StrongText({ children }: { children: ReactNode }) {
  return <strong>{children}</strong>;
}

export function EmphasizedText({ children }: { children: ReactNode }) {
  return <em>{children}</em>;
}
