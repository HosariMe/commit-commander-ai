import * as readline from 'readline';

export async function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}


export function selectFromList({
    question,
    options,
    message,
}: {
    question: string;
    options: string[];
    message: string;
}) {
    return new Promise((resolve) => {
        let selectedIndex = 0;

        // Enable raw mode to capture arrow keys
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        function displayMenu() {
            console.clear();
            console.log(question);
            console.log('Use ↑↓ arrows to navigate, Enter to select:\n');

            options.forEach((option, index) => {
                if (index === selectedIndex) {
                    console.log(`> ${option} <`);
                } else {
                    console.log(`  ${option}`);
                }
            });
        }

        function onKeyPress(key: string) {
            switch (key) {
                case '\u001b[A': // Up arrow
                    selectedIndex = Math.max(0, selectedIndex - 1);
                    displayMenu();
                    break;

                case '\u001b[B': // Down arrow
                    selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
                    displayMenu();
                    break;

                case '\r': // Enter key
                    process.stdin.setRawMode(false);
                    process.stdin.removeListener('data', onKeyPress);
                    process.stdin.resume();
                    console.log(`\nSelected: ${options[selectedIndex]}\n`);
                    resolve(options[selectedIndex]);
                    break;

                case '\u0003': // Ctrl+C
                    process.exit();
                    break;
            }
        }

        process.stdin.on('data', onKeyPress);
        displayMenu();
    });
}


