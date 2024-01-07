import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";
import package_ from "./package.json";

const manifest: ManifestV3Export = defineManifest(async () => ({
  manifest_version: 3,
  name: package_.name.replace(/-/g, " "),
  version: package_.version,
  host_permissions: ["file:///*"],
  permissions: ["downloads"],
  action: {
    default_popup: "index.html",
  },
}));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  // https://github.com/crxjs/chrome-extension-tools/issues/696#issuecomment-1526138970
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
