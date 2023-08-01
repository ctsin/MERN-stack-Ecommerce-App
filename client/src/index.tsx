import React from 'react';
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Auth } from "./Auth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Auth />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
