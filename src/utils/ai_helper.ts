// src/utils/ai-helper.ts
import https from 'https';
import { config } from '../config/env.js';


export async function generateCommitSuggestion(gitDiff: string): Promise<string> {
    const basePrompt = `Based on the provided git changes, analyze the code changes and suggest a conventional commit message in this EXACT format: "commit_type(scope): description"

Git changes:
${gitDiff}

STRICT RULES - You MUST follow exactly:
- commit_type: MUST be EXACTLY one of these (copy exactly with emoji): ${config.commitTypes.join(' | ')}
- scope: MUST be EXACTLY one of these (copy exactly with emoji): ${config.scopeTypes.join(' | ')}
- description: brief, clear description of what was changed (max 50 chars)

Response format: "commit_type(scope): description"

CRITICAL INSTRUCTIONS:
1. Use the EXACT commit types with their emojis from the list above
2. Use the EXACT scopes with their emojis from the list above  
3. Do NOT create new commit types or scopes
4. Do NOT add extra emojis
5. Analyze the git diff to choose the most appropriate commit type and scope
6. Keep description concise and descriptive

Only respond with the commit message in the exact format requested.`;

    // Add custom prompt if provided
    const prompt = config.customPrompt
        ? `${basePrompt}\n\nADDITIONAL INSTRUCTIONS:\n${config.customPrompt}`
        : basePrompt;

    const data = JSON.stringify({
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 100
        }
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/gemini-2.0-flash:generateContent`,
            method: 'POST',
            headers: {
                'X-goog-api-key': config.apiKey,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    const message = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion';
                    resolve(message.trim());
                } catch (error) {
                    reject(new Error(`Parse error: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}