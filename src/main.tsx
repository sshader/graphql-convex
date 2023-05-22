import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import "@graphiql/react/font/roboto.css";
import "@graphiql/react/font/fira-code.css";
import "@graphiql/react/dist/style.css";
import "./style.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("graphiql") as HTMLElement).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App></App>
    </ConvexProvider>
  </React.StrictMode>
);
