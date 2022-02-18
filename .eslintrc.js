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
}
