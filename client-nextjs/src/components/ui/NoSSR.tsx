'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function NoSSRComponent({ children, fallback }: NoSSRProps) {
  return <>{children}</>;
}

const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
  loading: ({ fallback }: { fallback?: ReactNode }) => <>{fallback}</>,
});

export default function NoSSRWrapper({ children, fallback = null }: NoSSRProps) {
  return <NoSSR fallback={fallback}>{children}</NoSSR>;
}
