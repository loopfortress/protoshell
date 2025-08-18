import { Type as T, type Static } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

export const AutoCompilerItemSchema = T.Object({
  path: T.String(),
})

export const ProtoShellJsonSchema = T.Object({
  autocompile: T.Record(T.String(), AutoCompilerItemSchema)
})

export type AutoCompilerItem = Static<typeof AutoCompilerItemSchema>
export type ProtoshellJson = Static<typeof ProtoShellJsonSchema>

export const validateProtoShellJson = TypeCompiler.Compile(ProtoShellJsonSchema)
