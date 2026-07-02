import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Packages `react` related packages come first.
            ['^react', '^@react'],
            // Next.js related packages.
            ['^next', '^@next'],
            // Other third-party packages.
            ['^@?\\w'],
            // Internal packages (using path alias `@/`).
            ['^@/'],
            // Other relative imports.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Types.
            ['^@/types', '^.*\\u0000$'],
            // Side effect imports / styles.
            ['^\\u0000', '^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
