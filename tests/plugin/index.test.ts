import TranspileInline from '../../plugin'
import pluginTester from 'babel-plugin-tester'
import { transformFileSync } from '@babel/core'

// TODO test everything with require() as well

// jest.mock('@babel/core')


pluginTester({
  plugin: TranspileInline,
  pluginName: 'transpile inline',

  filename: __filename,

  tests: {
    'should do nothing if there are no imports': {
      fixture: 'fixtures/input/no-import.js',
      pluginOptions: {},
    },
    'should do nothing for imports that don\'t match imports option': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { imports: 'does/not/exist' },
    },
    'should do nothing for imports that don\'t match files option': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { files: 'does/not/exist' },
    },

    'should inline imports that match imports option': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { imports: 'simple-export' },
      outputFixture: 'fixtures/output/import-simple.js',
    },
    'should inline imports that match files option': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { files: 'fixtures/**/*.js' },
      outputFixture: 'fixtures/output/import-simple.js',
    },
    // TODO import *

    'should fail if imports and files options are not defined': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: {},
      error: 'You must specific at least one of \'imports\' or \'files\'',
    },
    'should fail if imports option is not a string or string array': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { imports: 42 },
      error: '\'imports\' must be a string or string array',
    },
    'should fail if files option is not a string or string array': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { files: 42 },
      error: '\'files\' must be a string or string array',
    },
    'should fail if matching import uses named imports': {
      fixture: 'fixtures/input/import-named.js',
      pluginOptions: { imports: '*' },
      error: e => e instanceof SyntaxError
        && e.message.includes('Cannot use named imports for inlined imports'),
    },
    'should fail if transpilation fails': {
      fixture: 'fixtures/input/import-simple.js',
      pluginOptions: { imports: '*' },
      setup() {
        // jest.mock('@babel/core')
        // // @ts-ignore
        // babel.transformFileSync.mockImplementation(() => null)

        jest.mock('@babel/core', () => {
          return {
            transformFileSync: () => ({
              code: null,
            }),
          }
        })
      },
      error: e => e instanceof SyntaxError
        && e.message.includes('Failed to transpile before inlining'),
    },
  },
})
