# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## GitHub Pages Deployment

If the GitHub Pages deployment workflow fails with a `404 Not Found` error:
```
Error: Failed to create deployment (status: 404) ... Ensure GitHub Pages has been enabled: https://github.com/John-Bell/EBTracker/settings/pages
```

This error occurs when the repository is not configured to deploy from GitHub Actions. To resolve this:

1. Navigate to your repository on GitHub: **https://github.com/John-Bell/EBTracker**
2. Click on **Settings** in the top navigation bar.
3. In the left sidebar, click on **Pages** (under the *Code and automation* section).
4. Under **Build and deployment** -> **Source**, change the dropdown selection from **"Deploy from a branch"** to **"GitHub Actions"**.
5. Go to the **Actions** tab of your repository, select the failed run, and click **Re-run all jobs** (or push a new commit) to deploy successfully.
