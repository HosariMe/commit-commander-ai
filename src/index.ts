import { execSync } from 'child_process';
import { askQuestion, selectFromList, generateCommitSuggestion } from './utils/index.js';
import { COMMIT_TYPES, SCOPE_TYPES } from './constants/index.js';

async function main() {

    execSync('git add -A');
    console.log('Successfully added all files to staging');

    // Ask if user wants AI suggestion
    const useAI = await askQuestion('Use AI to suggest commit message? (y/N): ');

    if (useAI.toLowerCase() === 'y') {
        try {
            console.log('🤖 AI is analyzing your changes...');
            const gitChanges = execSync('git diff --cached', { encoding: 'utf8' });

            if (!gitChanges.trim()) {
                console.log('⚠️ No staged changes found for AI analysis.');
                console.log('Continuing with manual commit...\n');
            } else {
                const aiSuggestion = await generateCommitSuggestion(gitChanges);
                console.log(`🎯 AI Suggestion: ${aiSuggestion}\n`);

                const useAISuggestion = await askQuestion('Use this AI suggestion? (y/N): ');
                if (useAISuggestion.toLowerCase() === 'y') {
                    const details = await askQuestion('Add detailed description (optional): ');

                    // Commit with AI suggestion
                    if (details.trim()) {
                        execSync(`git commit -m "${aiSuggestion}" -m "${details}"`);
                    } else {
                        execSync(`git commit -m "${aiSuggestion}"`);
                    }
                    console.log('✅ Successfully committed with AI suggestion!');
                    return;
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log(`❌ AI suggestion failed: ${errorMessage}`);
            console.log('Continuing with manual commit...\n');
        }
    }

    // Manual commit process (original flow)
    console.log('📝 Manual commit process:');

    // Ask user for the type of the commit
    const type = await selectFromList({
        question: 'Select the type of commit:',
        options: COMMIT_TYPES,
        message: 'Enter the type of the commit: '
    });

    // Ask for scope
    const scope = await selectFromList({
        question: 'Select the scope of your changes:',
        options: SCOPE_TYPES,
        message: 'Enter the scope of your changes: '
    });

    // Ask for description
    const description = await askQuestion('Enter the description of your changes: ');

    // Ask for details
    const details = await askQuestion('Enter the details of your changes: ');

    // Show final commit message
    console.log('\n--- Commit Message ---');
    console.log(`${type}(${scope}): ${description}`);
    console.log('');
    console.log(details);
    console.log('---------------------\n');

    // Commit with proper structure
    execSync(`git commit -m "${type}(${scope}): ${description}" -m "${details}"`);
    console.log('✅ Successfully committed');

}


main()