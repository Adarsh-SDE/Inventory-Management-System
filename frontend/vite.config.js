import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    allowedHosts: [
      "inventory-management-system-frontend-113k.onrender.com"
    ]
  }
});
