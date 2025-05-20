'use client';

import { Suspense } from 'react';
import Loading from './loading';

export default function Template({ children }) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
} 