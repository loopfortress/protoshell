import chalk from 'chalk'

const LOG_INFO = process.env.LOG_INFO ? process.env.LOG_INFO === 'true' : true
const LOG_DEBUG = process.env.LOG_DEBUG ? process.env.LOG_DEBUG === 'true' : true

const INFO = chalk.blue('[i]')
const SUCCESS = chalk.green('[✓]')
const WARNING = chalk.yellow('[!]')
const ERROR = chalk.red('[✕]')
const DEBUG = chalk.gray('[>]')

export class Logger {
  constructor (public tag: string) {
  }

  fork (tag: string) {
    return new Logger(`${this.tag} ${tag}`)
  }

  log (level: string, message: string) {
    const timestamp = new Date().toISOString()
    console.error(`${timestamp} ${level} ${chalk.cyan(`${this.tag}`)} ${message}`)
  }

  notice (...message: any[]) {
    if (LOG_INFO) {
      this.log(INFO, message.join(' '))
    }
  }

  info (...message: any[]) {
    if (LOG_INFO) {
      this.log(INFO, chalk.blue(message.join(' ')))
    }
  }

  success (...message: any[]) {
    this.log(SUCCESS, chalk.green(message.join(' ')))
  }

  warn (...message: any[]) {
    this.log(WARNING, chalk.yellow(message.join(' ')))
  }

  error (...message: any[]) {
    this.log(ERROR, chalk.red(message.join(' ')))
  }

  debug (...message: any[]) {
    if (LOG_DEBUG) {
      this.log(DEBUG, chalk.gray(message.join(' ')))
    }
  }
}

