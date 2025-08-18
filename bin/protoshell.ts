#!/usr/bin/env node

import { ProtoShell } from '../src/ProtoShell/ProtoShell.js'
import fs from 'fs'
import path from 'path'
import { Logger } from '../src/utils/logger.js'

const logger = new Logger('[protoshell]')

// Template for .protoshell.json
const protoshellTemplate = {
  autocompile: {
    repo: {
      path: "."
    }
  }
}

// Template for .autocompile.json
const autocompileTemplate = {
  runners: {
    types: {
      watch: [{
        match: "**/*.ts",
        ignore: "**/*.d.ts"
      }],
      interpreter: "pnpm",
      command: "tsc"
    }
  }
}

// Function to initialize a config file
function initConfigFile(filePath: string, template: Record<string, any>): boolean {
  const fullPath = path.resolve(process.cwd(), filePath)

  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    logger.warn(`Config file already exists: ${fullPath}`)
    return false
  }

  try {
    // Write the template to the file
    fs.writeFileSync(fullPath, JSON.stringify(template, null, 2))
    logger.success(`Created config file: ${fullPath}`)
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Failed to create config file: ${error.message}`)
    } else {
      logger.error(`Failed to create config file: ${String(error)}`)
    }
    return false
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]

if (command === 'init') {
  // Handle init subcommand
  const projectFlag = args.includes('--project')

  if (projectFlag) {
    // Initialize .autocompile.json
    initConfigFile('.autocompile.json', autocompileTemplate)
  } else {
    // Initialize .protoshell.json
    initConfigFile('.protoshell.json', protoshellTemplate)
  }
} else {
  // Default behavior: load config and start protoshell
  const protoShell = await ProtoShell.loadConfig()
  if (protoShell) {
    protoShell.startProtoShell().catch((error) => {
      console.log('Error starting protoshell: ', error.message, '\n', error.stack, '\n', 'Exiting...')
    })
  }
}
