import { ComponentType, ReactNode, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export default function ErrorBoundaryWrapper({
  children,
  fallbackComponent,
}: {
  children: ReactNode;
  fallbackComponent: ComponentType<FallbackProps>;
}) {
  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
    </ErrorBoundary>
  );
}
