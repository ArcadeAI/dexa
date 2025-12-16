import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import safeword from "eslint-plugin-safeword";
import eslintConfigPrettier from "eslint-config-prettier";

// Read package.json relative to this config file (not CWD)
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

// Build dynamic ignores based on detected frameworks
const ignores = ["**/node_modules/", "**/dist/", "**/build/", "**/coverage/"];
if (deps["next"]) ignores.push(".next/");
if (deps["astro"]) ignores.push(".astro/");

// Select appropriate safeword config based on detected framework
// Order matters: most specific first
let baseConfig;
if (deps["next"]) {
  baseConfig = safeword.configs.recommendedTypeScriptNext;
} else if (deps["react"]) {
  baseConfig = safeword.configs.recommendedTypeScriptReact;
} else if (deps["astro"]) {
  baseConfig = safeword.configs.astro;
} else if (deps["typescript"] || deps["typescript-eslint"]) {
  baseConfig = safeword.configs.recommendedTypeScript;
} else {
  baseConfig = safeword.configs.recommended;
}

// Start with ignores + safeword config
const configs = [
  { ignores },
  ...baseConfig,
];

// Add test configs if testing frameworks detected
if (deps["vitest"]) {
  configs.push(...safeword.configs.vitest);
}
if (deps["playwright"] || deps["@playwright/test"]) {
  configs.push(...safeword.configs.playwright);
}

// eslint-config-prettier must be last to disable conflicting rules
configs.push(eslintConfigPrettier);

export default configs;
