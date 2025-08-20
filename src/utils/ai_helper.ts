// src/utils/ai-helper.ts
import https from 'https';
import { COMMIT_TYPES } from '../constants/commit_types.js';
import { SCOPE_TYPES } from '../constants/scope_types.js';
import { config } from '../config/env.js';


export async function generateCommitSuggestion(gitDiff: string): Promise<string> {
    const prompt = `Based on these git changes, suggest a conventional commit message with emojis in this exact format: "emoji type(scope): description"

Git changes:
${gitDiff}

Rules:
- emoji: appropriate emoji for the type (✨feat, 🐛fix, 📚docs, 💅style, ♻️refactor, ⚡perf, 🧪test, 📦build, 👷ci, 🔧chore)
- type: ${COMMIT_TYPES.join(', ')}
- scope: ${SCOPE_TYPES.join(', ')}
- description: brief description (max 50 chars)

Response format: "emoji type(scope): description"

Examples:
- "✨feat(auth): add user login functionality"
- "🐛fix(api): resolve authentication error"  
- "📚docs(readme): update installation guide"
- "♻️refactor(utils): improve code structure"`;

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
                'X-goog-api-key': config.GEMINI_API_KEY,
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