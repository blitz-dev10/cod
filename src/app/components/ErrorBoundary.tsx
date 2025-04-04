'use client';

import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      Swal.fire({
        title: 'Error',
        text: event.error?.message || 'An unexpected error occurred',
        icon: 'error'
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return <>{children}</>;
}