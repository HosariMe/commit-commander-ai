#!/usr/bin/env node

import { initializeConfig } from './commands/init.js';
import pkg from '../package.json' with { type: 'json' };
const { version } = pkg;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
    case 'initialize':
    case 'setup':
      await initializeConfig();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    case 'version':
    case '--version':
    case '-v':
      showVersion();
      break;

    default:
      // Default behavior - run the commit process
      const { runCommitProcess } = await import('./index.js');
      await runCommitProcess();
      break;
  }
}

function showHelp() {
  console.log(`
🚀 Commit Commander - AI-Powered Git Commits

USAGE:
  commit-commander [command]
  cc [command]

COMMANDS:
  init                 Initialize configuration file
  help                 Show this help message
  version              Show version information
  (no command)         Start the commit process

EXAMPLES:
  cc init             # Initialize commit-commander in your project
  cc                  # Create a commit with AI assistance
  commit-commander    # Same as above

CONFIGURATION:
  After running 'init', edit commit-commander.config.js to customize:
  - API key
  - Commit types and scopes
  - Custom AI prompts
  - Question preferences

More info: https://github.com/hosseinnaseriir/commit-commander
`);
}

function showVersion() {
  // In a real package, you'd import this from package.json
  console.log(`commit-commander v${version}`);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
