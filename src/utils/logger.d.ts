export declare class Logger {
    tag: string;
    constructor(tag: string);
    fork(tag: string): Logger;
    log(level: string, message: string): void;
    notice(...message: any[]): void;
    info(...message: any[]): void;
    success(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
    debug(...message: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map