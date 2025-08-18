import type { AutoCompileWatchRule } from '../schema/.autocompile.json.js';
import type { FSWatcher } from 'chokidar';
import { CommandRunner } from '../CommandRunner/CommandRunner.js';
import { Logger } from '../utils/logger.js';
export interface CommandWatcherConfig {
    name: string;
    cwd: string;
    interpreter: string;
    command: string;
    watch?: AutoCompileWatchRule[];
    logger?: Logger;
}
export declare class CommandWatcher {
    name: string;
    cwd: string;
    interpreter: string;
    command: string;
    watch?: AutoCompileWatchRule[];
    watcher?: FSWatcher;
    commandRunner: CommandRunner;
    logger: Logger;
    constructor(config: CommandWatcherConfig);
    matchRule(value: string, globPattern?: string | string[]): boolean;
    shouldReact(event: string, value: string): boolean;
    startWatcher(): void;
    stopWatcher(signal: NodeJS.Signals): Promise<void>;
}
//# sourceMappingURL=CommandWatcher.d.ts.map