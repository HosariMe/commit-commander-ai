// Commit Commander Configuration Example
// Copy this file to commit-commander.config.js and customize

module.exports = {
    // Your Gemini API Key (get from https://aistudio.google.com)
    apiKey: 'your_gemini_api_key_here',

    // Available commit types (with emojis)
    commitTypes: [
        '⭐feat',       // new feature
        '🐛fix',        // bug fixes
        '📝docs',       // documentation
        '💅style',      // formatting, styling
        '♻️refactor',   // refactoring code
        '⚡perf',       // performance improvements
        '🧪test',       // adding missing tests
        '📦build',      // build system changes
        '👷ci',         // CI configuration changes
        '🔧chore',      // other changes
        '↩️revert',     // reverts a previous commit
        '🚧wip',        // work in progress
        '🎉release',    // release a new version
        '🔄deps',       // dependency changes
        '🔄other'       // other changes
    ],

    // Available scope types (with emojis)  
    scopeTypes: [
        '🏠root',       // root/main changes
        '🔄utils',      // utility functions
        '🎨ui',         // user interface
        '🛠️api',        // API changes
        '📚docs',       // documentation
        '🔧config',     // configuration
        '🔄other'       // other scopes
    ],

    // Custom AI prompt instructions (optional)
    customPrompt: 'Focus on clear, concise commit messages that explain the "why" behind changes.',

    // Custom questions configuration
    customQuestions: {
        askForDetails: true,                                    // Always ask for detailed description
        detailsPrompt: 'Enter detailed description (optional): ', // Custom prompt for details
        confirmBeforeCommit: true                               // Always confirm before committing
    }
};
