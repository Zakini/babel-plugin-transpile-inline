import { join } from 'path'
import { readFileSync } from 'fs'
import { transformFileSync } from '@babel/core'
import TranspileInline, { Options } from '../../plugin'

export const fixturePath = (path: string) => join(__dirname, 'fixtures', path)
export const readFixture = (path: string) => readFileSync(fixturePath(path), { encoding: 'utf8' }).trimEnd()
export const run = (path: string, options: Options, transform: typeof transformFileSync = transformFileSync) => {
  const result = transform(path, {
    plugins: [
      [TranspileInline, options],
    ],
  })

  return result?.code
}
