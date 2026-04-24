import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setCredentials } from "@workspace/api-client-react";

setCredentials("include");

createRoot(document.getElementById("root")!).render(<App />);
