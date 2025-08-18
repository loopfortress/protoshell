import { ChildProcess, spawn } from 'child_process'
import { Logger } from '../utils/logger.js'

export interface CommandRunnerConfig {
  name: string
  cwd: string
  interpreter: string
  command: string
  watch?: string | { match: string; ignore?: string }[]
  type: 'command' | 'watcher'
  logger?: Logger
}

export class CommandRunner {
  name: string
  cwd: string
  interpreter: string
  command: string
  child?: ChildProcess
  logger: Logger
  type: 'command' | 'watcher'

  constructor (config: CommandRunnerConfig) {
    this.name = config.name
    this.cwd = config.cwd
    this.interpreter = config.interpreter
    this.command = config.command
    this.type = config.type
    const tag = `[${this.name}] $ ${this.interpreter} ${this.command}`
    this.logger = config.logger
      ? config.logger.fork(tag)
      : new Logger(tag)
  }

  /**
   * Start a watcher script with the appropriate interpreter
   */
  runCommand (forFile: string) {
    try {
      // Spawn the process with the appropriate interpreter
      this.logger.info(`${forFile} START`)
      this.logger.debug(`${forFile} cwd: ${this.cwd}`)

      const child: ChildProcess = spawn(this.interpreter, [this.command], {
        cwd: this.cwd,
        stdio: 'overlapped',
        shell: true
      })

      this.child = child

      const outputBuffer: Buffer[] = []
      const errorBuffer: Buffer[] = []

      child.stdout?.on('data', (data: Buffer) => {
        if (this.type === 'watcher') {
          outputBuffer.push(data)
        } else {
          this.logger.debug(`${forFile} > stdout: ${data}`)
        }
      })

      child.stderr?.on('data', (data: Buffer) => {
        if (this.type === 'watcher') {
          errorBuffer.push(data)
        } else {
          this.logger.error(`${forFile} > stderr: ${data}`)
        }
      })

      // Handle process exit
      child.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
        if (code === 0) {
          this.logger.success(`${forFile} DONE exited with code ${code} and signal ${signal}`)

          if (this.type === 'watcher') {
            if (errorBuffer.length > 0) {
              this.logger.error(`${forFile} > stderr:`)
              this.logger.notice(Buffer.concat(errorBuffer))
            }
          }
        } else {
          this.logger.warn(`${forFile} DONE exited with code ${code} and signal ${signal}`)
          if (this.type === 'watcher') {
            if (outputBuffer.length > 0) {
              this.logger.warn(`${forFile} > stdout:`)
              this.logger.notice(Buffer.concat(outputBuffer))
            }
            if (errorBuffer.length > 0) {
              this.logger.error(`${forFile} > stderr:`)
              this.logger.notice(Buffer.concat(errorBuffer))
            }
          }
        }

        this.child = undefined
      })

      // Handle process errors
      child.on('error', (err: Error) => {
        this.logger.error(`${forFile} Failed to start command: ${err.message}`)
      })
    } catch (error: any) {
      this.logger.error(`${forFile} Error starting command: ${error.message}`)
    }
  }

  stopCommand (signal: NodeJS.Signals) {
    if (this.child) {
      this.child.kill(signal)
    }
  }
}
