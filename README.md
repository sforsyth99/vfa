# React + TypeScript + Vite

## Checks before merging

Every pull request to `main` runs five checks on GitHub (`.github/workflows/checks.yml`). `main` only accepts a pull request when all five pass.

| Check | What it runs | What it catches |
|---|---|---|
| Type-check | `pnpm typecheck` (`tsc -b`) | TypeScript errors |
| Lint and format | `pnpm lint` and `pnpm format:check` | ESLint problems, and code not formatted by Prettier (Markdown is skipped) |
| Unit tests | `pnpm test:unit` | Failing Vitest tests (jsdom) |
| Storybook tests | `pnpm test:storybook` | Stories that fail to render or whose play tests fail (headless Chromium) |
| Build | `pnpm build:app` (`vite build`) | Anything that breaks the production build. Skips the sitemap so it never calls the live WordPress API |

Run them all locally before pushing:

```sh
pnpm check
```

- The first time, install the test browser: `pnpm exec playwright install chromium`.
- If only formatting fails, `pnpm format` fixes it.
- Use the Node version in `.nvmrc` and the pnpm version in `package.json` (`packageManager`).

**Package age rule:** `pnpm-workspace.yaml` sets `minimumReleaseAge` to 7 days. pnpm will not add or update to a version published less than a week ago, so a compromised release is usually caught before it reaches us.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
