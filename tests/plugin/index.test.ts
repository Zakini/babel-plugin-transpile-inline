import { fixturePath, readFixture, run } from './helpers'

describe('transpile inline plugin', () => {
  describe('no-ops', () => {
    it('should do nothing if there are no imports', () => {
      const inputPath = fixturePath('input/no-import.js')
      const input = readFixture('input/no-import.js')
      const pluginOptions = {}

      expect(run(inputPath, pluginOptions)).toMatch(input)
    })

    it('should do nothing for imports that don\'t match imports option', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const input = readFixture('input/import-simple.js')
      const pluginOptions = { imports: 'does/not/exist' }

      expect(run(inputPath, pluginOptions)).toMatch(input)
    })

    it('should do nothing for imports that don\'t match files option', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const input = readFixture('input/import-simple.js')
      const pluginOptions = { files: 'does/not/exist' }

      expect(run(inputPath, pluginOptions)).toMatch(input)
    })
  })

  describe('transpile inline', () => {
    it('should inline imports that match imports option', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { imports: 'simple-export' }

      const output = readFixture('output/import-simple.js')

      expect(run(inputPath, pluginOptions)).toMatch(output)
    })

    it('should inline imports that match files option', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { files: 'fixtures/**/*.js' }

      const output = readFixture('output/import-simple.js')

      expect(run(inputPath, pluginOptions)).toMatch(output)
    })
  })

  describe('failures', () => {
    it('should fail if imports and files options are not defined', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = {}

      expect(() => run(inputPath, pluginOptions))
        .toThrow('You must specific at least one of \'imports\' or \'files\'')
    })

    it('should fail if imports option is not a string', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { imports: 42 }

      expect(() => run(inputPath, pluginOptions))
        .toThrow('\'imports\' must be a string or string array')
    })

    it('should fail if imports option is not a string array', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { imports: [42] }

      expect(() => run(inputPath, pluginOptions))
        .toThrow('\'imports\' must be a string or string array')
    })

    it('should fail if files option is not a string', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { files: 42 }

      expect(() => run(inputPath, pluginOptions))
        .toThrow('\'files\' must be a string or string array')
    })

    it('should fail if files option is not a string array', () => {
      const inputPath = fixturePath('input/import-simple.js')
      const pluginOptions = { files: [42] }

      expect(() => run(inputPath, pluginOptions))
        .toThrow('\'files\' must be a string or string array')
    })

    it('should fail if matching import uses named imports', () => {
      const inputPath = fixturePath('input/import-named.js')
      const pluginOptions = { imports: '*' }

      expect(() => run(inputPath, pluginOptions))
        .toThrowWithMessage(SyntaxError, /Cannot use named imports for inlined imports/)
    })
  })
})
