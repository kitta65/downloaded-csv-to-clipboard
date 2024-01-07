import { defineConfig } from "vite";
import { defineManifest } from "@crxjs/vite-plugin";
import { crx } from "@crxjs/vite-plugin";

import packageJson from "./package.json";

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: "Saved CSV to Clipboard",
  version: packageJson.version,
  action: {
    default_popup: "index.html",
  },
}));

export default defineConfig({
  plugins: [crx({ manifest })],
});
