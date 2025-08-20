import { execSync } from 'child_process';
import { askQuestion, selectFromList, generateCommitSuggestion } from './utils/index.js';
import { config } from './config/env.js';

export async function runCommitProcess() {

    execSync('git add -A');
    console.log('Successfully added all files to staging');

    // Ask if user wants AI suggestion
    const useAI = await askQuestion('🤖 Use AI to suggest commit message? (Y/n): ');

    if (useAI.toLowerCase() !== 'n') {
        try {
            console.log('🤖 AI is analyzing your changes...');
            const gitChanges = execSync('git diff --cached', { encoding: 'utf8' });

            if (!gitChanges.trim()) {
                console.log('⚠️ No staged changes found for AI analysis.');
                console.log('Continuing with manual commit...\n');
            } else {
                const aiSuggestion = await generateCommitSuggestion(gitChanges);
                console.log(`🎯 AI Suggestion: ${aiSuggestion}\n`);

                const useAISuggestion = await askQuestion('Use this AI suggestion? (Y/n): ');
                if (useAISuggestion.toLowerCase() !== 'n') {
                    let details = '';

                    // Ask for details if configured
                    if (config.customQuestions?.askForDetails) {
                        const detailsPrompt = config.customQuestions.detailsPrompt || 'Add detailed description (optional): ';
                        details = await askQuestion(detailsPrompt);
                    }

                    // Confirm before commit if configured
                    let shouldCommit = true;
                    if (config.customQuestions?.confirmBeforeCommit) {
                        const confirm = await askQuestion('Confirm commit? (Y/n): ');
                        shouldCommit = confirm.toLowerCase() !== 'n';
                    }

                    if (shouldCommit) {
                        // Commit with AI suggestion
                        if (details.trim()) {
                            execSync(`git commit -m "${aiSuggestion}" -m "${details}"`);
                        } else {
                            execSync(`git commit -m "${aiSuggestion}"`);
                        }
                        console.log('✅ Successfully committed with AI suggestion!');
                    } else {
                        console.log('❌ Commit cancelled.');
                    }
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
    if (useAI.toLowerCase() === 'n') {
        console.log('✋ AI skipped, proceeding with manual commit...');
    }
    console.log('\n📝 Manual commit process:');
    console.log('Creating commit manually...\n');

    // Ask user for the type of the commit
    const type = await selectFromList({
        question: 'Select the type of commit:',
        options: config.commitTypes,
        message: 'Enter the type of the commit: '
    });

    // Ask for scope
    const scope = await selectFromList({
        question: 'Select the scope of your changes:',
        options: config.scopeTypes,
        message: 'Enter the scope of your changes: '
    });

    // Ask for description
    const description = await askQuestion('Enter the description of your changes: ');

    // Ask for details if configured
    let details = '';
    if (config.customQuestions?.askForDetails) {
        const detailsPrompt = config.customQuestions.detailsPrompt || 'Enter the details of your changes: ';
        details = await askQuestion(detailsPrompt);
    }

    // Show final commit message
    console.log('\n--- Commit Message ---');
    console.log(`${type}(${scope}): ${description}`);
    if (details) {
        console.log('');
        console.log(details);
    }
    console.log('---------------------\n');

    // Confirm before commit if configured
    let shouldCommit = true;
    if (config.customQuestions?.confirmBeforeCommit) {
        const confirm = await askQuestion('Confirm commit? (Y/n): ');
        shouldCommit = confirm.toLowerCase() !== 'n';
    }

    if (shouldCommit) {
        // Commit with proper structure
        if (details.trim()) {
            execSync(`git commit -m "${type}(${scope}): ${description}" -m "${details}"`.toLowerCase());
        } else {
            execSync(`git commit -m "${type}(${scope}): ${description}"`.toLowerCase());
        }
        console.log('✅ Successfully committed');
    } else {
        console.log('❌ Commit cancelled.');
    }

}

