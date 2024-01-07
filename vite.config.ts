import { defineConfig } from "vite";
import { ManifestV3Export, defineManifest, crx } from "@crxjs/vite-plugin";

import package_ from "./package.json";

const manifest: ManifestV3Export = defineManifest(async () => ({
  manifest_version: 3,
  name: "Downloaded CSV to Clipboard",
  version: package_.version,
  permissions: ["downloads"],
  background: {
    service_worker: "src/background.ts",
  },
  host_permissions: ["file:///*"],
  content_scripts: [
    {
      js: ["src/content.ts"],
      matches: ["<all_urls>"],
    },
  ],
}));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [crx({ manifest })],
  // https://github.com/crxjs/chrome-extension-tools/issues/696#issuecomment-1526138970
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
