import { type ProtoshellJson, validateProtoShellJson } from '../schema/.protoshell.json.js'
import { AutoCompileProject } from '../AutoCompileProject/AutoCompileProject.js'
import { Logger } from '../utils/logger.js'
import fs from 'fs'
import path from 'path'

const logger = new Logger('[protoshell]')

export class ProtoShell {
  config: ProtoshellJson
  autoCompilers: AutoCompileProject[] = []

  static async loadConfig () {
    const protoShellConfigPath = process.env.PROTOSHELL_CONFIG
      ? process.env.PROTOSHELL_CONFIG
      : './.protoshell.json'

    const protoShellJsonPath = path.resolve(process.cwd(), protoShellConfigPath)

    if (!process.env.PROTOSHELL_CONFIG)  {
      logger.warn(`PROTOSHELL_CONFIG not set`)
    }

    logger.debug(`Loading protoshell from ${protoShellJsonPath}`)

    try {
      const buffer = fs.readFileSync(protoShellJsonPath)
      if (!buffer) {
        throw new Error(`Config file not found: ${protoShellJsonPath}`)
      }
      const json = JSON.parse(buffer.toString())
      const valid = validateProtoShellJson.Check(json)
      if (!valid) {
        const all = [...validateProtoShellJson.Errors(json)]
        logger.error('Invalid config file', JSON.stringify(all, null, 2))
        throw new Error(`Invalid config file: ${protoShellJsonPath}`)
      }
      return new ProtoShell(json as ProtoshellJson)
    } catch (error: any) {
      logger.error(`Error loading config: ${error.message}`)
      return null
    }
  }

  constructor(config: ProtoshellJson) {
    this.config = config
  }

  async startProtoShell() {
    await this.startAutoCompile()
  }

  async startAutoCompile() {
    for (const [name, autocompilerConfig] of Object.entries(this.config.autocompile)) {
      const autocompiler = new AutoCompileProject(name, autocompilerConfig, logger)
      this.autoCompilers.push(autocompiler)
      const okay = await autocompiler.loadConfig()
      if (!okay) {
        logger.error(`AutoCompile project ${name} failed to start. Stopping all other autocompilers...`)
        this.stopAutoCompile('SIGTERM')
        return false
      }
    }

    logger.info('Starting autocompilers: ', this.autoCompilers.map(autocompiler => autocompiler.name).join(','))
    for (const autocompiler of this.autoCompilers) {
      await autocompiler.startAutoCompile()
    }

    // Set up process signal handlers
    const terminateProcesses = (signal: NodeJS.Signals) => {
      logger.warn(`Received ${signal}. Terminating child processes...`)
      this.stopAutoCompile(signal)
      process.exit(0)
    }

    // Handle termination signals
    process.on('SIGINT', () => terminateProcesses('SIGINT'))
    process.on('SIGTERM', () => terminateProcesses('SIGTERM'))

    // Keep the process running until all child processes exit
    logger.success('All watchers started. Waiting for completion...')

    // This prevents the Node.js process from exiting while child processes are running
    // Similar to the "wait" command in bash
    process.stdin.resume()

    return true
  }

  stopAutoCompile(signal: NodeJS.Signals) {
    this.autoCompilers.forEach((autocompiler) => {
      autocompiler.stopAutoCompile(signal)
    })
  }
}
