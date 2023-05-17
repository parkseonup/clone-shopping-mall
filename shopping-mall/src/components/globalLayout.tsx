import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

function GlobalLayout() {
  return (
    <Suspense fallback="로딩 중...">
      <Outlet />
    </Suspense>
  );
}

export default GlobalLayout;
