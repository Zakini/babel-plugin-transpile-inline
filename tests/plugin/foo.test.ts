import { transformFileSync } from '@babel/core'
import TranspileInline from '../../plugin'
// import fs from 'fs'
import path from 'path'

jest.mock('@babel/core', () => {
  return {
    transformFileSync: () => ({
      code: null,
    }),
  }
})

const inputPath = path.join(__dirname, 'fixtures/input/import-simple.js')
// const input = fs.readFileSync(path.join(__dirname, 'fixtures/input/import-simple.js'), { encoding: 'utf8' })
// const output = fs.readFileSync(path.join(__dirname, 'fixtures/output/import-simple.js'), { encoding: 'utf8' }).trimEnd()

// it('should work', () => {
//   const result = transformFileSync(inputPath, { plugins: [[TranspileInline, { imports: '*' }]] })
//   expect(result?.code).toMatch(output)
// })

// it('should mock', () => {
//   const result = transformFileSync(inputPath, { plugins: [[TranspileInline, { imports: '*' }]] })
//   expect(result).toMatch('mocked')
// })

it('should fail if transpilation fails', () => {
  const { transformFileSync: actualTransformFileSync } = jest.requireActual('@babel/core')

  expect(() => actualTransformFileSync(inputPath, { plugins: [[TranspileInline, { imports: '*' }]] }))
    .toThrow('Failed to transpile before inlining')
})
