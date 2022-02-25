module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'ignorePatterns': ['dist'],
  'rules': {
    'indent': ['error', 2],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
  },
  'overrides': [
    {
      'files': 'tests/**/fixtures/**/*',
      'rules': {
        // babel applies some style changes, so need to match those in input
        // fixtures when asserting that a file hasn't changed
        'semi': ['error', 'always'],
        'quotes': ['error', 'double'],
      },
    },
  ],
}
