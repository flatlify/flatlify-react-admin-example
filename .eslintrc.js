module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
  },
  plugins: ['react'],
  rules: {
    quotes: ['error', 'single'],
    'no-shadow': 'off',
    'operator-linebreak': 'off',
    'no-underscore-dangle': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-use-before-define': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
};
