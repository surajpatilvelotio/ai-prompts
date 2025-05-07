# AI Prompts Library

This repository contains a collection of AI prompts for various tasks, domains, and technologies. The prompts are organized by category and are designed to be reused across different contexts.

## Overview

The prompt library is a resource for the entire organization to leverage AI assistants effectively. By sharing and reusing high-quality prompts, we can:

- Save time by not reinventing prompts for common tasks
- Establish best practices for interacting with AI tools
- Learn from each other's expertise in specific domains
- Continuously improve our prompting strategies

## Repository Structure

```
ai-prompts/
├── README.md                  # This file
├── CONTRIBUTING.md            # Contribution guidelines
├── prompts/                   # All prompts organized by category
│   ├── domains/               # Domain-specific prompts
│   ├── technologies/          # Technology-specific prompts
│   ├── use-cases/             # Cross-functional use cases
│   ├── templates/             # Prompt templates
├── site/                      # GitHub Pages site for browsing prompts
├── .github/                   # GitHub workflows and templates
```

## Web Interface

Browse prompts with our searchable web interface:

- **GitHub Pages Site**: https://[username].github.io/ai-prompts/
- **Features**:
  - Search functionality to find prompts by keyword
  - Filter by prompt type, category, and tags
  - Copy button for easily copying prompts
  - Dark-themed UI optimized for readability

## How to Use

1. **Browse Online**: Visit the GitHub Pages site for a user-friendly interface
2. **Browse Repository**: Explore the directories in the `prompts/` folder
3. **Use Templates**: Find templates for creating your own prompts in `prompts/templates/`
4. **Copy Prompts**: Copy the content from the `## Prompt` section for use with AI assistants

## Contributing

We welcome contributions from everyone in the organization! See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on how to contribute.

## Local Development

To run the site locally:

1. Clone this repository
2. Navigate to the site directory: `cd site`
3. Generate the prompt index: 
   ```
   npm init -y
   npm install glob
   node generate-index.js
   ```
4. Serve the directory: `npx http-server -p 8000`
5. Open your browser at `http://localhost:8000`

## License

This repository is for internal use only. All prompts and related content are confidential and proprietary. 