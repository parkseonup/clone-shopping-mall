import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./app";
import { worker } from "./mocks/browser";

if (import.meta.env.DEV) {
  worker.start();
}

/** router 사용을 위해 애플리케이션 root를 BrowserRouter로 감싼다 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
