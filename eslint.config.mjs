import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import tailwindPlugin from 'eslint-plugin-tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Core Next.js recommended rules and TypeScript support
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Tailwind CSS recommended rules
  ...compat.extends('plugin:tailwindcss/recommended'),

  // TanStack Query recommended rules
  ...compat.extends('plugin:@tanstack/query/recommended'),

  // Prettier - make sure this comes last to override formatting rules
  prettierConfig,

  // Your custom configurations (as a flat config object)
  {
    plugins: {
      import: importPlugin,
      tailwindcss: tailwindPlugin, // You might need to re-register tailwind plugin here if needed for custom rules
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-undef': 'off', // Keep your override rule if needed
    },
    settings: {
      tailwindcss: {
        callees: ['cn', 'cva'],
        config: 'tailwind.config.ts',
      },
    },
    ignores: ['components/ui/**'],
    files: ['*.ts', '*.tsx'],
  },
];

export default eslintConfig;
