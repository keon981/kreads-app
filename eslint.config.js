import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript and Vue are autodetected, you can also explicitly enable them:
  typescript: true,
  vue: false,
  nextjs: true,
  react: true,
  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,
  ignores: [
    '**/fixtures',
    '**/dist',
    '**/next',
    'next-env.d.ts',
    '**/node_modules',
    '**/coverage',
    '**/build',
    '**/public',
    '**/*.md',
  ],
  rules: {
    'react-refresh/only-export-components': 'off',
    'style/jsx-one-expression-per-line': 'off',
    'style/jsx-curly-spacing': 'off',
    'style/jsx-child-element-spacing': 'off',

    'brace-style': ['error', '1tbs'],
    'style/brace-style': ['error', '1tbs'],
    'no-console': 'warn',
    'no-nested-ternary': 'error',
    'antfu/if-newline': 'off',

    'react/prefer-namespace-import': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'perfectionist/sort-imports': ['error', {
      customGroups: [
        {
          groupName: 'nextjs',
          elementNamePattern: '^next$',
        },
        {
          groupName: 'nextjs-related',
          elementNamePattern: '^next/',
        },
        {
          groupName: 'react',
          elementNamePattern: '^react$',
        },
        {
          groupName: 'react-related',
          elementNamePattern: '^react-',
        },
        {
          groupName: 'tanstack-react',
          elementNamePattern: '^@tanstack/react-',
        },
        {
          groupName: 'type-react',
          elementNamePattern: '^react$',
          modifiers: ['type'],
        },
        {
          groupName: 'type-react-related',
          elementNamePattern: '^react-',
          modifiers: ['type'],
        },
        {
          groupName: 'type-tanstack-react',
          elementNamePattern: '^@tanstack/react-',
          modifiers: ['type'],
        },
        {
          groupName: 'type-internal',
          elementNamePattern: '^@/',
          modifiers: ['type'],
        },
        {
          groupName: 'type-relative',
          elementNamePattern: '^\\.',
          modifiers: ['type'],
        },
      ],
      groups: [
        'nextjs',
        'nextjs-related',
        'react',
        ['react-related', 'tanstack-react'],
        'external',
        'builtin',
        'internal',
        ['parent', 'sibling', 'index'],
        ['type-react', 'type-react-related', 'type-tanstack-react'],
        { newlinesBetween: 0 },
        'type',
        { newlinesBetween: 0 },
        'type-internal',
        { newlinesBetween: 0 },
        'type-relative',
        'side-effect',
        'unknown',
      ],
      newlinesBetween: 1,
      order: 'asc',
      type: 'natural',
    }],
  },
}, {
  // 針對生成的檔案禁用特定規則
  files: ['**/*.gen.ts', '**/*.gen.tsx'],
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
    'eslint-comments/no-unused-disable': 'off',
  },
}, {
  // 針對生成的檔案禁用特定規則
  files: ['**/*.config.ts', '**/lib/env.ts'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})
