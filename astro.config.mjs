import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://converso-demo.pages.dev",
  output: "static",
  devToolbar: {
    enabled: false
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: true
    }
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
