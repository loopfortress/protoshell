import { type ProtoshellJson } from '../schema/.protoshell.json.js';
import { AutoCompileProject } from '../AutoCompileProject/AutoCompileProject.js';
export declare class ProtoShell {
    config: ProtoshellJson;
    autoCompilers: AutoCompileProject[];
    static loadConfig(): Promise<ProtoShell | null>;
    constructor(config: ProtoshellJson);
    startProtoShell(): Promise<void>;
    startAutoCompile(): Promise<boolean>;
    stopAutoCompile(signal: NodeJS.Signals): void;
}
//# sourceMappingURL=ProtoShell.d.ts.map