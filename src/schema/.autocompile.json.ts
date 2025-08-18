import { Type as T, type Static } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

export const AutoCompileWatchRuleSchema = T.Object({
  match: T.Union([T.String(), T.Array(T.String())]),
  ignore: T.Optional(T.Union([T.String(), T.Array(T.String())])),
})

export const AutoCompileRunnerSchema = T.Object({
  watch: T.Optional(T.Array(AutoCompileWatchRuleSchema)),
  interpreter: T.String(),
  command: T.String()
})

export const AutoCompileJsonSchema = T.Object({
  runners: T.Record(T.String(), AutoCompileRunnerSchema)
})

export type AutoCompileWatchRule = Static<typeof AutoCompileWatchRuleSchema>
export type AutoCompileRunner = Static<typeof AutoCompileRunnerSchema>
export type AutoCompileJson = Static<typeof AutoCompileJsonSchema>

export const validateAutoCompilerJson = TypeCompiler.Compile(AutoCompileJsonSchema)
