import { dirname } from 'path'
import resolveFrom from 'resolve-from'
import { transformFileSync as transformFile, PluginObj, types as t } from '@babel/core'

type Plugin = () => PluginObj

const TranspileInline: Plugin = () => ({
  visitor: {
    ImportDeclaration: {
      exit(path, state) {
        if (path.node.specifiers.length > 1) {
          throw path.buildCodeFrameError('Cannot use named imports for inlined imports')
        }

        if (!state.file.opts.filename) {
          throw new Error('Could not get filename')
        }

        const importPath = path.node.source.value
        const absoluteImportPath = resolveFrom(dirname(state.file.opts.filename), importPath)
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
