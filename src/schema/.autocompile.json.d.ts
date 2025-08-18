import { type Static } from '@sinclair/typebox';
export declare const AutoCompileWatchRuleSchema: import("@sinclair/typebox").TObject<{
    match: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>;
    ignore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
}>;
export declare const AutoCompileRunnerSchema: import("@sinclair/typebox").TObject<{
    watch: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        match: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>;
        ignore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
    }>>>;
    interpreter: import("@sinclair/typebox").TString;
    command: import("@sinclair/typebox").TString;
}>;
export declare const AutoCompileJsonSchema: import("@sinclair/typebox").TObject<{
    runners: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        watch: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            match: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>;
            ignore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
        }>>>;
        interpreter: import("@sinclair/typebox").TString;
        command: import("@sinclair/typebox").TString;
    }>>;
}>;
export type AutoCompileWatchRule = Static<typeof AutoCompileWatchRuleSchema>;
export type AutoCompileRunner = Static<typeof AutoCompileRunnerSchema>;
export type AutoCompileJson = Static<typeof AutoCompileJsonSchema>;
export declare const validateAutoCompilerJson: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    runners: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        watch: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            match: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>;
            ignore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
        }>>>;
        interpreter: import("@sinclair/typebox").TString;
        command: import("@sinclair/typebox").TString;
    }>>;
}>>;
//# sourceMappingURL=.autocompile.json.d.ts.map