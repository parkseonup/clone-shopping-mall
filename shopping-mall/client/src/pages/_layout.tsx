import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

// TODO: Suspense란?
const Layout: React.FC = () => {
  return (
    <div>
      <Suspense fallback={"loading..."}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
