# Contributing Guidelines

Thank you for your interest in contributing to the AI Chatbot project! This document outlines the process for contributing to the project and guidelines to follow.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to help us maintain a respectful and collaborative environment.

## Getting Started

### Prerequisites

Before you begin contributing, make sure you have:

- Node.js (v18.0.0 or higher)
- PNPM (v9.12.3 or higher)
- PostgreSQL (v14 or higher)
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/ai-chatbot.git
   cd ai-chatbot
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/ai-chatbot.git
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Create and configure your `.env.local` file (see [Setup documentation](./setup.md) for details)
6. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branching Strategy

We follow a GitHub Flow branching strategy:

1. Create a new branch for each feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. Make your changes on this branch
3. Keep your branch up to date with upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or tools

Examples:
```
feat(chat): add message editing functionality
fix(auth): resolve login redirection issue
docs(readme): update installation instructions
```

### Pull Request Process

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Go to the original repository and create a Pull Request
3. Fill out the PR template with all required information
4. Wait for code review and address any feedback
5. Once approved, your PR will be merged

## Coding Standards

### TypeScript Style Guide

We follow these TypeScript coding standards:

- Use TypeScript for all new code
- Define types for all variables, parameters, and return values
- Prefer interfaces for object types
- Use type guards for runtime type checking
- Follow the existing code style

### React Component Guidelines

When creating or modifying React components:

- Use functional components with hooks
- Separate UI components from logic
- Use TypeScript for component props
- Keep components focused on a single responsibility
- Follow the existing project structure

### CSS/Styling Guidelines

For styling:

- Use Tailwind CSS utility classes
- Follow the existing component styling patterns
- Use CSS variables for theming
- Ensure responsive design across all screen sizes

## Testing

All contributions should include appropriate tests:

- Write tests for new features
- Update tests for modified features
- Ensure all tests pass before submitting a PR
- Run tests with `pnpm test`

See the [Testing documentation](./testing.md) for more details.

## Documentation

Update documentation for any changes:

- Update relevant documentation files in the `/docs` directory
- Add inline code comments for complex logic
- Update README.md if needed
- Include examples for new features

## Feature Requests and Bug Reports

### Submitting Feature Requests

For feature requests:

1. Check if the feature has already been requested in the issues
2. If not, create a new issue using the feature request template
3. Clearly describe the feature and its value
4. Include mockups or examples if possible

### Reporting Bugs

For bug reports:

1. Check if the bug has already been reported
2. If not, create a new issue using the bug report template
3. Include detailed steps to reproduce
4. Include expected and actual behavior
5. Include browser/OS information
6. Include screenshots if applicable

## Code Review Process

All code reviews follow these guidelines:

1. All contributions require at least one review
2. Reviewers will check for:
   - Code quality and adherence to standards
   - Test coverage
   - Documentation updates
   - Performance considerations
   - Security implications
3. Address all review comments
4. Once approved, maintainers will merge the PR

## Release Process

The project follows a continuous integration approach:

1. Changes are merged to `main` after review
2. CI/CD pipeline runs tests and builds
3. Releases are tagged with semantic versions
4. Release notes are generated from commit messages

## Getting Help

If you need help with contributing:

- Check the documentation
- Create a discussion in the GitHub repository
- Reach out to the maintainers
- Join our community chat

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [LICENSE](../LICENSE).

---

Thank you for your contributions to the AI Chatbot project! Your efforts help improve the application for everyone. 