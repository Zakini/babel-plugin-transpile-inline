import { dirname } from 'path'
import resolveFrom from 'resolve-from'
import { transformFileSync as transformFile, PluginObj, types as t, PluginPass } from '@babel/core'
import { isMatch as match } from 'micromatch'

type Plugin = () => PluginObj
export type Options = {
  imports?: unknown,
  files?: unknown,
}
type State = PluginPass & { opts: Options }

const isValidOption = (value: unknown): value is string | string[] | null =>
  typeof value === 'string'
    || (Array.isArray(value) && value.every(v => typeof v === 'string'))
    || value === null

const TranspileInline: Plugin = () => ({
  visitor: {
    ImportDeclaration: {
      exit(path, state: State) {
        const { imports = null, files = null } = state.opts

        if (!imports && !files) {
          throw new Error('You must specific at least one of \'imports\' or \'files\'')
        }

        if (!isValidOption(imports)) {
          throw new Error('\'imports\' must be a string or string array')
        }

        if (!isValidOption(files)) {
          throw new Error('\'files\' must be a string or string array')
        }

        if (!state.file.opts.filename) {
          throw new Error('Could not get filename')
        }

        const importPath = path.node.source.value
        const absoluteImportPath = resolveFrom(dirname(state.file.opts.filename), importPath)

        const importsMatch = imports && match(importPath, imports, { contains: true })
        const filesMatch = files && match(absoluteImportPath, files, { contains: true })
        if (!importsMatch && !filesMatch) {
          return
        }

        if (path.node.specifiers.length > 1 || path.node.specifiers[0].type !== 'ImportDefaultSpecifier') {
          throw path.buildCodeFrameError('Cannot use named imports for inlined imports')
        }

        const variableName = path.node.specifiers[0].local.name
        const transpiledContent = transformFile(absoluteImportPath)?.code

        if (!transpiledContent) {
          throw path.buildCodeFrameError('Failed to transpile before inlining')
        }

        const variable = t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(variableName), t.stringLiteral(transpiledContent)),
        ])

        path.replaceWith(variable)
        path.addComment('leading', ` babel-plugin-transpile-inline '${importPath}' `)
      },
    },
  },
})

export default TranspileInline
