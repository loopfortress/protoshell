#!/usr/bin/env node

import { ProtoShell } from '../src/ProtoShell/ProtoShell.js'

const protoShell = await ProtoShell.loadConfig()
if (protoShell) {
  protoShell.startProtoShell().catch((error) => {
    console.log('Error starting protoshell: ', error.message, '\n', error.stack, '\n', 'Exiting...')
  })
}
