module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  env: {
    development: {
      presets: ['next/babel'],
    },
    production: {
      presets: [
        'next/babel',
        [
          'env',
          {
            targets: {
              node: '8',
            },
          },
        ],
      ],
    },
    test: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              modules: 'commonjs',
            },
          },
        ],
      ],
    },
  },
};
