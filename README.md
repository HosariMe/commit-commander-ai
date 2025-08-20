# 🚀 Commit Commander AI

AI-powered Git commit assistant that helps you create professional, meaningful commit messages with ease.

## ✨ Features

- 🤖 **AI-Powered Suggestions** - Uses Google Gemini AI to analyze your changes and suggest commit messages
- 🎯 **Conventional Commits** - Follows conventional commit standards with emojis
- ⚡ **Arrow Key Navigation** - Smooth terminal UI with arrow key selection
- 🔧 **Fully Customizable** - Configure commit types, scopes, and AI prompts
- 🎨 **Emoji Support** - Beautiful commits with meaningful emojis
- 📦 **Zero Runtime Dependencies** - Uses only Node.js built-ins

## 📦 Installation

### As a Dev Dependency (Recommended)

```bash
npm install --save-dev commit-commander-ai
# or
yarn add --dev commit-commander-ai
# or
pnpm add --save-dev commit-commander-ai
```

### Global Installation

```bash
npm install -g commit-commander-ai
```

## 🚀 Quick Start

### 1. Initialize Configuration

After installation, initialize the configuration in your project:

```bash
npx commit-commander-ai init
# or if installed globally
commit-commander-ai init
```

This will:
- Ask for your Gemini API key
- Set up commit types and scopes
- Configure custom questions
- Create a `commit-commander.config.mjs` file

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API key"**
4. Copy your API key when prompted during init

### 3. Start Using It

```bash
npx commit-commander-ai
# or use the short alias
npx cc
```

## ⚙️ Configuration

The `commit-commander.config.mjs` file allows full customization:

```javascript
export default {
    // Your Gemini API Key
    apiKey: 'your_api_key_here',

    // Available commit types (with emojis)
    commitTypes: [
        '⭐feat',       // new feature
        '🐛fix',        // bug fixes
        '📝docs',       // documentation
        '💅style',      // formatting
        '♻️refactor',   // refactoring
        '⚡perf',       // performance
        '🧪test',       // tests
        '📦build',      // build system
        '👷ci',         // CI changes
        '🔧chore'       // maintenance
    ],

    // Available scope types (with emojis)  
    scopeTypes: [
        'root',       // root changes
        'utils',      // utilities
        'ui',         // user interface
        'api'        // API changes
    ],

    // Custom AI prompt (optional)
    customPrompt: 'Focus on clear, concise messages',

    // Question preferences
    customQuestions: {
        askForDetails: true,
        detailsPrompt: 'Enter detailed description: ',
        confirmBeforeCommit: true
    }
};
```

## 🎯 Usage Examples

### Basic Usage
```bash
npx cc
```

### Initialize in New Project
```bash
npx cc init
```

### Package.json Scripts
Add to your `package.json`:

```json
{
  "scripts": {
    "commit": "commit-commander-ai",
    "c": "cc"
  }
}
```

Then use:
```bash
npm run commit
# or
npm run c
```

## 🔧 Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `commit-commander-ai` | `cc` | Start commit process |
| `commit-commander-ai init` | `cc init` | Initialize configuration |
| `commit-commander-ai help` | `cc help` | Show help |
| `commit-commander-ai version` | `cc --version` | Show version |

## 🤖 AI Features

- **Smart Analysis**: AI reads your `git diff` to understand changes
- **Conventional Format**: Generates proper `type(scope): description` format
- **Context Aware**: Suggests appropriate commit types based on file changes
- **Custom Instructions**: Add your own AI prompt guidelines

## 🎨 Commit Types

Default commit types with emojis:

| Type | Emoji | Description |
|------|-------|-------------|
| `feat` | ⭐ | New features |
| `fix` | 🐛 | Bug fixes |
| `docs` | 📝 | Documentation |
| `style` | 💅 | Formatting, styling |
| `refactor` | ♻️ | Code refactoring |
| `perf` | ⚡ | Performance improvements |
| `test` | 🧪 | Adding tests |
| `build` | 📦 | Build system changes |
| `ci` | 👷 | CI configuration |
| `chore` | 🔧 | Maintenance tasks |

## 🔒 Security

- Configuration file (`commit-commander.config.mjs`) is automatically added to `.gitignore`
- API keys are stored locally and never shared
- Works completely offline after initial setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Hossein Naseri](https://github.com/hosseinnaseriir)

## 🙋‍♂️ Support

- 📧 Email: naseri.develop@gmail.com  
- 🐛 Issues: [GitHub Issues](https://github.com/hosseinnaseriir/commit-commander/issues)
- 💡 Features: [GitHub Discussions](https://github.com/hosseinnaseriir/commit-commander/discussions)

---

**Happy Committing! 🚀✨**
