'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function printPage() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

export default function PrintArea({ children, className = '' }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <section className={`print-area hidden ${className}`.trim()}>
      {children}
    </section>,
    document.body
  );
}
