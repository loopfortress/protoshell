import { minimatch } from 'minimatch'
import type { AutoCompileWatchRule } from '../schema/.autocompile.json.js'
import chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
import { CommandRunner } from '../CommandRunner/CommandRunner.js'
import { Logger } from '../utils/logger.js'

export interface CommandWatcherConfig {
  name: string,
  cwd: string,
  interpreter: string,
  command: string,
  watch?: AutoCompileWatchRule[],
  logger?: Logger
}

export class CommandWatcher {
  name: string
  cwd: string
  interpreter: string
  command: string
  watch?: AutoCompileWatchRule[]
  watcher?: FSWatcher
  commandRunner: CommandRunner
  logger: Logger

  constructor (config: CommandWatcherConfig) {
    this.name = config.name
    this.cwd = config.cwd
    this.interpreter = config.interpreter
    this.command = config.command
    this.watch = config.watch

    const tag = `[runner:${this.name}]`
    this.logger = config.logger
      ? config.logger.fork(tag)
      : new Logger(tag)

    this.commandRunner = new CommandRunner({
      type: 'watcher',
      name: 'cmd',
      cwd: this.cwd,
      interpreter: this.interpreter,
      command: config.command,
      logger: this.logger
    })
  }

  matchRule (value: string, globPattern?: string | string[]) {
    if (!globPattern) return false
    if (typeof globPattern === 'string') return minimatch(value, globPattern)
    if (Array.isArray(globPattern)) return globPattern.some(ignore => minimatch(value, ignore))
    return false
  }

  shouldReact (event: string, value: string) {
    if (!this.watch) {
      this.logger.debug(`[${event}] [skip] ${value}: no watch rules defined`)
      return false
    }

    const ignoredBy = this.watch.find((rule) => {
      return this.matchRule(value, rule.ignore)
    })

    if (ignoredBy) {
      this.logger.debug(`[${event}] [skip] ${value}: ignored by ${ignoredBy.ignore}`)
      return false
    }

    const matchedRule = this.watch.find((rule) => {
      return this.matchRule(value, rule.match)
    })

    if (!matchedRule) {
      this.logger.debug(`[${event}] [skip] ${value}: no matching rule`)
      return false
    }

    this.logger.debug(`[${event}] [match] ${value}: matched by ${matchedRule.match}`)

    return true
  }

  startWatcher () {
    this.logger.info(`Watching ${this.cwd}`)

    const watcher = chokidar.watch('.', {
      cwd: this.cwd,
      persistent: true,
      ignoreInitial: true
    })

    this.watcher = watcher

    let lastRun = 0

    watcher
      .on('add', (filePath: string) => {
        if (!this.shouldReact('add', filePath)) return
        this.logger.info(`[add] ${filePath}`)
      })
      .on('change', (filePath: string) => {
        if (!this.shouldReact('changed', filePath)) return

        if (Date.now() - lastRun < 1000) {
          this.logger.debug(`[changed] [debounce] ${filePath}`)
          return
        }
        lastRun = Date.now()
        this.logger.success(`[changed] [run: ${this.interpreter} ${this.command}] ${filePath}`)
        this.commandRunner.runCommand(filePath)
      })
  }

  async stopWatcher (signal: NodeJS.Signals) {
    if (this.watcher) {
      await this.watcher.close()
      this.commandRunner.stopCommand(signal)
    }
  }
}
