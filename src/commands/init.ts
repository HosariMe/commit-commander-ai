// Initialize commit-commander-ai configuration
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { askQuestion } from '../utils/ask.js';
import pkg from '../../package.json' with { type: 'json' };
const { version } = pkg;

interface CommitCommanderConfig {
    apiKey: string;
    commitTypes: string[];
    scopeTypes: string[];
    customPrompt?: string;
    customQuestions?: {
        askForDetails: boolean;
        detailsPrompt: string;
        confirmBeforeCommit: boolean;
    };
}

export async function initializeConfig(): Promise<void> {
    console.log('🚀 Welcome to Commit Commander Setup!');
    console.log('Let\'s configure your AI-powered commit assistant.\n');

    const configPath = join(process.cwd(), 'commit-commander.config.js');

    // Check if config already exists
    if (existsSync(configPath)) {
        const overwrite = await askQuestion('Configuration file already exists. Overwrite? (Y/n): ');
        if (overwrite.toLowerCase() === 'n') {
            console.log('Setup cancelled.');
            return;
        }
    }

    // Collect configuration
    console.log('🔑 API Key Configuration:');
    const apiKey = await askQuestion('Enter your Gemini API Key: ');

    console.log('\n📝 Commit Types Configuration (optional):');
    const useDefaultTypes = await askQuestion('Use default commit types? (Y/n): ');

    let commitTypes: string[];
    if (useDefaultTypes.toLowerCase() === 'n') {
        console.log('Enter custom commit types (comma-separated with emojis) (optional):');
        console.log('Example: ✨feat,🐛fix,📚docs,♻️refactor');
        const customTypes = await askQuestion('Custom commit types: ');
        commitTypes = customTypes.split(',').map(type => type.trim()).filter(type => type);

        // Fallback to defaults if user provided empty input
        if (commitTypes.length === 0) {
            console.log('📦 No custom types provided, using defaults...');
            commitTypes = [
                '⭐feat', '🐛fix', '📝docs', '💅style', '♻️refactor',
                '⚡perf', '🧪test', '📦build', '👷ci', '🔧chore',
                '↩️revert', '🚧wip', '🎉release', '🔄deps', '🔄other'
            ];
        }
    } else {
        commitTypes = [
            '⭐feat', '🐛fix', '📝docs', '💅style', '♻️refactor',
            '⚡perf', '🧪test', '📦build', '👷ci', '🔧chore',
            '↩️revert', '🚧wip', '🎉release', '🔄deps', '🔄other'
        ];
    }

    console.log('\n🎯 Scope Types Configuration (optional):');
    const useDefaultScopes = await askQuestion('Use default scope types? (Y/n): ');

    let scopeTypes: string[];
    if (useDefaultScopes.toLowerCase() === 'n') {
        console.log('Enter custom scope types (comma-separated with emojis) (optional):');
        console.log('Example: 🏠root,🔄utils,🎨ui,🛠️api');
        const customScopes = await askQuestion('Custom scope types: ');
        scopeTypes = customScopes.split(',').map(scope => scope.trim()).filter(scope => scope);

        // Fallback to defaults if user provided empty input
        if (scopeTypes.length === 0) {
            console.log('📦 No custom scopes provided, using defaults...');
            scopeTypes = ['🏠root', '🔄utils', '🔄other'];
        }
    } else {
        scopeTypes = ['🏠root', '🔄utils', '🔄other'];
    }

    console.log('\n💬 Custom AI Prompt (optional):');
    const customPrompt = await askQuestion('Add custom instructions for AI? (optional): ');

    console.log('\n⚙️ Additional Settings:');
    const askForDetails = await askQuestion('Always ask for detailed description? (Y/n): ');
    console.log('Custom details prompt (leave empty for default):');
    console.log('Default: "Enter detailed description (optional): "');
    const detailsPrompt = await askQuestion('Custom prompt (or press Enter): ');
    const confirmBeforeCommit = await askQuestion('Always confirm before committing? (Y/n): ');

    // Handle common "no" responses for details prompt
    const defaultDetailsPrompt = 'Enter detailed description (optional): ';
    const finalDetailsPrompt = detailsPrompt.trim() === '' ||
        detailsPrompt.toLowerCase() === 'n' ||
        detailsPrompt.toLowerCase() === 'no' ||
        detailsPrompt.toLowerCase() === 'none'
        ? defaultDetailsPrompt
        : detailsPrompt;

    const customQuestionsConfig = {
        askForDetails: askForDetails.toLowerCase() !== 'n',
        detailsPrompt: finalDetailsPrompt,
        confirmBeforeCommit: confirmBeforeCommit.toLowerCase() !== 'n'
    };

    const config: CommitCommanderConfig = {
        apiKey,
        commitTypes,
        scopeTypes,
        ...(customPrompt && { customPrompt }),
        customQuestions: customQuestionsConfig
    };

    // Generate config file content
    const configContent = `// Commit Commander Configuration
// Generated on ${new Date().toISOString()}

export default {
    // Your Gemini API Key
    apiKey: '${config.apiKey}',

    // Available commit types (with emojis)
    commitTypes: [
        ${config.commitTypes.map(type => `'${type}'`).join(',\n        ')}
    ],

    // Available scope types (with emojis)  
    scopeTypes: [
        ${config.scopeTypes.map(scope => `'${scope}'`).join(',\n        ')}
    ],

    ${config.customPrompt ? `// Custom AI prompt instructions
    customPrompt: '${config.customPrompt}',` : ''}

    // Custom questions configuration
    customQuestions: {
        askForDetails: ${customQuestionsConfig.askForDetails},
        detailsPrompt: '${customQuestionsConfig.detailsPrompt}',
        confirmBeforeCommit: ${customQuestionsConfig.confirmBeforeCommit}
    }
};`;

    // Write config file
    try {
        writeFileSync(configPath, configContent, 'utf8');
        console.log('\n✅ Configuration saved successfully!');
        console.log(`📁 Config file created: ${configPath}`);
        console.log('\n🎯 Next steps:');
        console.log('1. Add commit-commander.config.js to your .gitignore (contains API key)');
        console.log('2. Run "npx commit-commander-ai" or "cc" to start using it');
        console.log('3. You can edit the config file anytime to customize further');
        console.log('\n🚀 Happy committing!');
    } catch (error) {
        console.error('❌ Failed to create configuration file:', error);
    }
}
