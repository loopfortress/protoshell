import { type AutoCompilerItem } from '../schema/.protoshell.json.js';
import type { FSWatcher } from 'chokidar';
import { Logger } from '../utils/logger.js';
import { CommandRunner } from '../CommandRunner/CommandRunner.js';
import { CommandWatcher } from '../CommandWatcher/CommandWatcher.js';
export declare class AutoCompileProject {
    name: string;
    config: AutoCompilerItem;
    watcher?: FSWatcher;
    logger: Logger;
    commandRunners: CommandRunner[];
    commandWatchers: CommandWatcher[];
    cwd: string;
    constructor(name: string, config: AutoCompilerItem, logger?: Logger);
    loadConfig(): Promise<boolean>;
    startAutoCompile(): Promise<void>;
    stopAutoCompile(signal: NodeJS.Signals): void;
}
//# sourceMappingURL=AutoCompileProject.d.ts.map