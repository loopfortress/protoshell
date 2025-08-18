import { type AutoCompilerItem } from '../schema/.protoshell.json.js'
import type { FSWatcher } from 'chokidar'
import path from 'path'
import util from 'util'
import fs from 'fs'
import { Logger } from '../utils/logger.js'
import {
  type AutoCompileJson,
  validateAutoCompilerJson
} from '../schema/.autocompile.json.js'
import { CommandRunner } from '../CommandRunner/CommandRunner.js'
import { CommandWatcher } from '../CommandWatcher/CommandWatcher.js'
import * as process from 'node:process'

const stat = util.promisify(fs.stat)

export class AutoCompileProject {
  name: string
  config: AutoCompilerItem
  watcher?: FSWatcher
  logger: Logger
  commandRunners: CommandRunner[] = []
  commandWatchers: CommandWatcher[] = []
  cwd: string

  constructor (name: string, config: AutoCompilerItem, logger?: Logger) {
    this.name = name
    this.config = config
    const tag = `[project:${this.name}]`
    this.logger = logger
      ? logger.fork(tag)
      : new Logger(tag)
    this.cwd = path.join(process.cwd(), this.config.path)
  }

  async loadConfig () {
    const compileConfigPath = path.join(this.cwd, '.autocompile.json')

    this.logger.debug('Loading config', compileConfigPath)
    this.logger.debug('cwd:', this.cwd)

    try {
      await stat(compileConfigPath)
    } catch (error) {
      this.logger.error(`config not found: ${compileConfigPath}`)
      return false
    }

    let compileConfig: AutoCompileJson

    try {
      const buffer = fs.readFileSync(compileConfigPath)
      if (!buffer) {
        this.logger.error(`Config file not found: ${compileConfigPath}`)
        return false
      }
      const json = JSON.parse(buffer.toString()) as AutoCompileJson
      const valid = validateAutoCompilerJson.Check(json)
      if (!valid) {
        const all = [...validateAutoCompilerJson.Errors(json)]
        this.logger.error('Invalid config file', compileConfigPath, JSON.stringify(all, null, 2))
        return false
      }
      this.logger.success('Config loaded')
      compileConfig = json
    } catch (error) {
      console.error(`Error loading AutoCompile config: ${compileConfigPath}`, error)
      return false
    }

    const runnerConfigs = compileConfig.runners || {}

    for (const [name, compiler] of Object.entries(runnerConfigs)) {
      const { watch, interpreter, command } = compiler
      if (watch) {
        const commandWatcher = new CommandWatcher({
          name,
          cwd: this.cwd,
          interpreter,
          command,
          watch,
          logger: this.logger
        })
        this.commandWatchers.push(commandWatcher)
      } else {
        const commandRunner = new CommandRunner({
          type: 'command',
          name,
          cwd: this.cwd,
          interpreter,
          command
        })
        this.commandRunners.push(commandRunner)
      }
    }

    return true
  }

  async startAutoCompile () {
    if (!this.commandRunners.length && !this.commandWatchers.length) {
      this.logger.warn('No runners found in config')
    }

    this.logger.info('Starting AutoCompile commands:', this.commandRunners.map((runner) => {
      return runner.name
    }).join(','))

    for (const commandRunner of this.commandRunners) {
      commandRunner.runCommand('.')
    }

    this.logger.info('Starting AutoCompile watchers:', this.commandWatchers.map((runne) => {
      return runne.name
    }).join(','))
    for (const commandWatcher of this.commandWatchers) {
      commandWatcher.startWatcher()
    }
  }

  stopAutoCompile (signal: NodeJS.Signals) {
    this.logger.info(`Stopping AutoCompile runners`)
    for (const commandRunner of this.commandRunners) {
      commandRunner.stopCommand(signal)
    }
    for (const commandWatcher of this.commandWatchers) {
      commandWatcher.stopWatcher(signal).catch(error => {
        this.logger.error('Error stopping watcher', commandWatcher.name, error)
      })
    }
  }
}
