# Contributing to Cook Healthy AI

First off, thank you for considering contributing to Cook Healthy AI! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps** which reproduce the problem
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected** to see instead
- **Include screenshots** if possible

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Describe the current behavior** and explain which behavior you expected
- **Explain why this enhancement would be useful**

### 🔧 Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a clear commit message

## Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/cook-healthy-ai.git
cd cook-healthy-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

## Project Structure

```
src/
├── app/           # Next.js pages
├── components/    # React components
├── lib/           # Core logic
├── data/          # Mock data
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🙏
