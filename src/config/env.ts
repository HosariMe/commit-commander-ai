// Environment configuration loader
import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvironmentConfig {
    GEMINI_API_KEY: string;
}

function loadEnvironmentConfig(): EnvironmentConfig {
    try {
        // First try to read from .env file
        const envPath = join(process.cwd(), '.env');
        const envFile = readFileSync(envPath, 'utf8');

        const config: Partial<EnvironmentConfig> = {};

        // Parse .env file
        envFile.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').replace(/^["'](.*)["']$/, '$1');
                    (config as any)[key.trim()] = value.trim();
                }
            }
        });

        // Fallback to process.env if not found in .env file
        const GEMINI_API_KEY = config.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not found in .env file or environment variables');
        }

        return { GEMINI_API_KEY };
    } catch (error) {
        // If .env file doesn't exist, try environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error('❌ Environment configuration error:');
            console.error('Please create a .env file in the project root with:');
            console.error('GEMINI_API_KEY=your_api_key_here');
            console.error('');
            console.error('Or set the GEMINI_API_KEY environment variable.');
            process.exit(1);
        }

        return { GEMINI_API_KEY };
    }
}

export const config = loadEnvironmentConfig();
