import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";
import package_ from "./package.json";

const manifest: ManifestV3Export = defineManifest(async () => ({
  manifest_version: 3,
  name: package_.name.replace(/-/g, " "),
  version: package_.version,
  host_permissions: ["file:///*"],
}));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
