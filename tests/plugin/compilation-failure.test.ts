import { fixturePath, run } from './helpers'

// TODO figure out how to mock this for a single test, then merge this file into index.test.ts
jest.mock('@babel/core', () => {
  const babel = jest.requireActual('@babel/core')

  return Object.create(
    Object.getPrototypeOf(babel),
    {
      ...Object.getOwnPropertyDescriptors(babel),
      transformFileSync: {
        value: () => ({
          code: null,
        }),
      },
    },
  )
})

const { transformFileSync } = jest.requireActual('@babel/core')

describe('transpile inline plugin', () => {
  it('should fail if transpilation fails', () => {

    const inputPath = fixturePath('input/import-simple.js')
    const pluginOptions = { imports: '*' }

    expect(() => run(inputPath, pluginOptions, transformFileSync))
      .toThrowWithMessage(SyntaxError, /Failed to transpile before inlining/)
  })
})
