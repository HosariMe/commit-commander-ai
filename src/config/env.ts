// Commit Commander configuration loader
import { existsSync } from 'fs';
import { join } from 'path';

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

async function loadConfig(): Promise<CommitCommanderConfig> {
    const configPath = join(process.cwd(), 'commit-commander.config.mjs');

    try {
        // Check if config file exists
        if (!existsSync(configPath)) {
            console.error('❌ Configuration not found!');
            console.error('');
            console.error('Please run the initialization command first:');
            console.error('  npx commit-commander-ai init');
            console.error('  or');
            console.error('  cc init');
            console.error('');
            console.error('This will create a commit-commander.config.mjs file with your settings.');
            process.exit(1);
        }

        // Use dynamic import for .mjs config file - convert Windows path to file:// URL
        const configUrl = process.platform === 'win32'
            ? `file:///${configPath.replace(/\\/g, '/')}`
            : configPath;
        const configModule = await import(configUrl);
        const config = configModule.default;

        // Validate required fields
        if (!config.apiKey) {
            console.error('❌ API key not found in configuration!');
            console.error('Please edit commit-commander.config.mjs and add your Gemini API key.');
            process.exit(1);
        }

        if (!config.commitTypes || !Array.isArray(config.commitTypes) || config.commitTypes.length === 0) {
            console.log('⚠️ No commit types found, using defaults...');
            config.commitTypes = [
                '⭐feat', '🐛fix', '📝docs', '💅style', '♻️refactor',
                '⚡perf', '🧪test', '📦build', '👷ci', '🔧chore',
                '↩️revert', '🚧wip', '🎉release', '🔄deps', '🔄other'
            ];
        }

        if (!config.scopeTypes || !Array.isArray(config.scopeTypes) || config.scopeTypes.length === 0) {
            console.log('⚠️ No scope types found, using defaults...');
            config.scopeTypes = ['root', 'utils', 'other'];
        }

        // Fix invalid detailsPrompt values
        if (config.customQuestions) {
            if (config.customQuestions.detailsPrompt) {
                const prompt = config.customQuestions.detailsPrompt.trim();
                if (prompt === 'n' || prompt === 'no' || prompt === 'none' || prompt === '') {
                    console.log('⚠️ Invalid details prompt found, using default...');
                    config.customQuestions.detailsPrompt = 'Enter detailed description (optional): ';
                }
            } else {
                // If detailsPrompt is missing, add default
                config.customQuestions.detailsPrompt = 'Enter detailed description (optional): ';
            }
        } else {
            // If customQuestions is missing entirely, add defaults
            config.customQuestions = {
                askForDetails: true,
                detailsPrompt: 'Enter detailed description (optional): ',
                confirmBeforeCommit: true
            };
        }

        return config;

    } catch (error) {
        console.error('❌ Failed to load configuration:', error instanceof Error ? error.message : String(error));
        console.error('');
        console.error('Try running: npx commit-commander-ai init');
        process.exit(1);
    }
}

export const config = await loadConfig();
