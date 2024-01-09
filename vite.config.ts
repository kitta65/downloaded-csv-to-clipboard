import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";
import package_ from "./package.json";

// i don't know why but tripl slash is not working
// https://stackoverflow.com/questions/72146352/vitest-defineconfig-test-does-not-exist-in-type-userconfigexport
import type { InlineConfig } from "vitest";
import type { UserConfig } from "vite";
interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

const manifest: ManifestV3Export = defineManifest(async () => ({
  manifest_version: 3,
  name: package_.name.replace(/-/g, " "),
  description: "copy downloaded CSV file to clipboard",
  version: package_.version,
  host_permissions: ["file:///*"],
  permissions: ["downloads"],
  action: {
    default_popup: "index.html",
  },
  icons: {
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.ts"],
    },
  ],
  background: {
    service_worker: "src/background.ts",
  },
}));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  test: {},
  // https://github.com/crxjs/chrome-extension-tools/issues/696#issuecomment-1526138970
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
} as VitestConfigExport);
