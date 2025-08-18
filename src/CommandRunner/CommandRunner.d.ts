import { ChildProcess } from 'child_process';
import { Logger } from '../utils/logger.js';
export interface CommandRunnerConfig {
    name: string;
    cwd: string;
    interpreter: string;
    command: string;
    watch?: string | {
        match: string;
        ignore?: string;
    }[];
    type: 'command' | 'watcher';
    logger?: Logger;
}
export declare class CommandRunner {
    name: string;
    cwd: string;
    interpreter: string;
    command: string;
    child?: ChildProcess;
    logger: Logger;
    type: 'command' | 'watcher';
    constructor(config: CommandRunnerConfig);
    /**
     * Start a watcher script with the appropriate interpreter
     */
    runCommand(forFile: string): void;
    stopCommand(signal: NodeJS.Signals): void;
}
//# sourceMappingURL=CommandRunner.d.ts.map