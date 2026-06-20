import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setAuthTokenGetter } from "@workspace/api-client-react";

document.documentElement.classList.add('dark');

setAuthTokenGetter(() => {
  return localStorage.getItem('vortex_admin_token');
});

createRoot(document.getElementById("root")!).render(<App />);
