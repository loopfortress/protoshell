import { type Static } from '@sinclair/typebox';
export declare const AutoCompilerItemSchema: import("@sinclair/typebox").TObject<{
    path: import("@sinclair/typebox").TString;
}>;
export declare const ProtoShellJsonSchema: import("@sinclair/typebox").TObject<{
    autocompile: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
    }>>;
}>;
export type AutoCompilerItem = Static<typeof AutoCompilerItemSchema>;
export type ProtoshellJson = Static<typeof ProtoShellJsonSchema>;
export declare const validateProtoShellJson: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    autocompile: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
    }>>;
}>>;
//# sourceMappingURL=.protoshell.json.d.ts.map