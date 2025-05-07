# Organizational Prompt Library: GitHub Repository with Slack Integration

## Overview

This document outlines a complete solution for creating, maintaining, and accessing an organizational prompt library using GitHub as the storage platform with Slack integration for easy access and contributions.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   GitHub Repo   │<─────│   Slack App     │<─────│    Users        │
│   Prompt Library│─────>│   Integration   │─────>│                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 1. GitHub Repository Structure

### Repository Organization

```
ai-prompts/
├── README.md                 # Overview, contribution guidelines
├── CONTRIBUTING.md           # Detailed contribution instructions
├── prompts/                  # All prompts organized by category
│   ├── domains/              # Domain-specific prompts
│   │   ├── product-management/
│   │   │   ├── README.md     # Overview of PM prompts
│   │   │   ├── user-stories.md
│   │   │   ├── roadmap-planning.md
│   │   ├── engineering/
│   │   │   ├── README.md
│   │   │   ├── code-review.md
│   │   │   ├── technical-design.md
│   │   ├── design/
│   │   │   ├── README.md
│   │   │   ├── design-critique.md
│   ├── technologies/         # Technology-specific prompts
│   │   ├── python/
│   │   │   ├── README.md
│   │   │   ├── data-processing.md
│   │   │   ├── testing.md
│   │   ├── javascript/
│   │   │   ├── README.md
│   │   │   ├── react-components.md
│   │   ├── sql/
│   │   │   ├── README.md
│   │   │   ├── query-optimization.md
│   ├── use-cases/            # Cross-functional use cases
│   │   ├── onboarding/
│   │   ├── documentation/
│   │   ├── presentations/
│   ├── templates/            # Prompt templates
│   │   ├── basic-template.md
│   │   ├── advanced-template.md
├── .github/                  # GitHub specific files
│   ├── ISSUE_TEMPLATE/
│   │   ├── prompt-request.md
│   │   ├── prompt-improvement.md
│   ├── workflows/
│   │   ├── validate-prompts.yml
│   │   ├── deploy-site.yml
├── site/                     # GitHub Pages files
│   ├── index.html
│   ├── generate-index.js
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── prompt-index.json
│   ├── scripts/
```

### Prompt Format

Each prompt file should follow a consistent structure:

```markdown
# [Prompt Title]

## Description
Brief description of what the prompt is for and when to use it.

## Tags
- tag1
- tag2
- tag3

## Prompt
```
[The actual prompt text goes here]
```

## Example Usage
Example of how to use this prompt with an AI assistant.

## Example Output
Sample of what good output looks like.

## Contributed By
@username - Date

## Version History
- v1.0 (2023-09-15): Initial version
- v1.1 (2023-10-20): Added section for handling edge cases
```

## 2. GitHub Pages Integration

Set up GitHub Pages to create a searchable frontend for the prompt library:

1. Implementation includes:
   - A dark-themed UI with a search bar and filtering options
   - Cards displaying prompt information (title, description, tags, contributor)
   - Modal popup for viewing full prompt details
   - Responsive design for different screen sizes

2. Technical implementation:
   - Pure HTML, CSS, and JavaScript without requiring a build step
   - Client-side search functionality
   - Markdown rendering using showdown.js
   - User avatars generated dynamically based on usernames

3. Files structure:
   ```
   site/
   ├── index.html                 # Main HTML file
   ├── generate-index.js          # Script to generate a prompt index
   ├── assets/
   │   ├── css/
   │   │   └── style.css          # Styling for the site
   │   └── js/
   │       ├── main.js            # Main JavaScript functionality
   │       └── prompt-index.json  # Generated index of all prompts (via script)
   ```

4. GitHub Actions workflow:
   - Automatically updates the site when new prompts are added
   - Generates the prompt index file on each deploy
   - Deploys to GitHub Pages branch (gh-pages)

## 3. Slack Integration

### Slack App Setup

1. Create a Slack App in the Slack API dashboard
2. Enable the following features:
   - Slash commands
   - Bot user
   - Incoming webhooks
   - Permissions for channels:read, chat:write

### Slash Commands

Implement the following slash commands:

1. `/prompt-search [query]` - Search for prompts
2. `/prompt-get [prompt-id]` - Get a specific prompt
3. `/prompt-contribute` - Start the contribution flow
4. `/prompt-recent` - List recently added prompts

### Notification System

1. Configure GitHub webhook to notify a Slack channel when:
   - New prompts are added (PR merged)
   - Prompt improvements are made
   - New prompt requests are filed

## 4. Implementation Steps

### Phase 1: Repository Setup (Week 1-2)

1. Create the GitHub repository with the structure outlined above
2. Develop initial prompt templates and examples
3. Document contribution guidelines
4. Seed the repository with 20-30 high-quality prompts across different domains

### Phase 2: GitHub Pages Development (Week 3-4)

1. Set up GitHub Pages with a basic template
2. Implement search functionality
3. Create category and tag-based navigation
4. Set up GitHub Actions to automatically update the site when new prompts are added

### Phase 3: Slack Integration (Week 5-6)

1. Develop the Slack app with required slash commands
2. Implement GitHub webhook integration for notifications
3. Create interactive messages for prompt display
4. Deploy the integration to production

### Phase 4: Testing and Rollout (Week 7-8)

1. Conduct user testing with a small group
2. Gather feedback and make improvements
3. Create documentation and training materials
4. Roll out to the entire organization

## 5. GitHub Webhook Server

For the Slack integration, we'll need a small server to handle webhook events:

```javascript
// Example server code (Node.js with Express)
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

// Verify GitHub webhook signature
function verifyGithubWebhook(req) {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return signature === digest;
}

app.post('/github-webhook', (req, res) => {
  // Verify webhook signature
  if (!verifyGithubWebhook(req)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  // Handle PR merged events
  if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request.merged) {
    const pr = payload.pull_request;
    
    // Check if this PR adds a new prompt (by analyzing file paths)
    const hasNewPrompt = pr.changed_files.some(file => 
      file.filename.endsWith('.md') && 
      file.filename.includes('prompts/') &&
      !file.filename.includes('README.md')
    );
    
    if (hasNewPrompt) {
      // Notify Slack
      axios.post(SLACK_WEBHOOK_URL, {
        text: `🎉 New prompt added: "${pr.title}" by @${pr.user.login}\n${pr.html_url}`
      });
    }
  }
  
  // Handle new issues that are prompt requests
  if (event === 'issues' && payload.action === 'opened') {
    const issue = payload.issue;
    
    if (issue.title.toLowerCase().includes('[prompt request]')) {
      // Notify Slack
      axios.post(SLACK_WEBHOOK_URL, {
        text: `📝 New prompt requested: "${issue.title}" by @${issue.user.login}\n${issue.html_url}`
      });
    }
  }
  
  res.status(200).send('Webhook received');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

## 6. Slack App Implementation

### Slack App Manifest

```yaml
display_information:
  name: Prompt Library
  description: Access and contribute to the organizational prompt library
  background_color: "#4A154B"

features:
  bot_user:
    display_name: Prompt Library
    always_online: true
  slash_commands:
    - command: /prompt-search
      description: Search for prompts
      usage_hint: "[query]"
    - command: /prompt-get
      description: Get a specific prompt
      usage_hint: "[prompt-id]"
    - command: /prompt-contribute
      description: Start the contribution flow
    - command: /prompt-recent
      description: List recently added prompts

oauth_config:
  scopes:
    bot:
      - channels:read
      - chat:write
      - commands
      - files:read
      - files:write

settings:
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```

### Search Implementation

```javascript
// Example handler for /prompt-search slash command
app.command('/prompt-search', async ({ command, ack, respond }) => {
  await ack();
  
  const query = command.text;
  
  if (!query) {
    return respond({
      text: "Please provide a search term. Example: `/prompt-search python testing`"
    });
  }
  
  try {
    // Search GitHub repository using GitHub API
    const searchResults = await searchPrompts(query);
    
    if (searchResults.length === 0) {
      return respond({
        text: `No prompts found for "${query}". Would you like to request one?`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `No prompts found for "${query}". Would you like to request one?`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Request Prompt"
                },
                value: query,
                action_id: "request_prompt"
              }
            ]
          }
        ]
      });
    }
    
    // Format results for Slack
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Found ${searchResults.length} prompts matching "${query}"`
        }
      },
      ...searchResults.slice(0, 5).flatMap(result => [
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${result.title}*\n${result.description.substring(0, 120)}...`
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "View"
            },
            value: result.id,
            action_id: "view_prompt"
          }
        }
      ])
    ];
    
    if (searchResults.length > 5) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `_...and ${searchResults.length - 5} more. View all results on the <${process.env.GITHUB_PAGES_URL}?q=${encodeURIComponent(query)}|Prompt Library website>._`
        }
      });
    }
    
    return respond({
      blocks
    });
  } catch (error) {
    console.error(error);
    return respond({
      text: "An error occurred while searching prompts. Please try again later."
    });
  }
});
```

## 7. Maintenance and Governance

### Roles and Responsibilities

1. **Repository Maintainers**
   - Review and merge PRs
   - Manage repository organization
   - Ensure prompt quality and standards

2. **Domain Experts**
   - Contribute domain-specific prompts
   - Review prompts in their expertise area
   - Identify gaps in the prompt library

3. **Bot Administrators**
   - Maintain the Slack integration
   - Monitor usage and address issues
   - Implement new features based on feedback

### Quality Standards

1. Every prompt should include:
   - Clear description
   - Tags for searchability
   - Example usage
   - Example output

2. Prompts should be:
   - Clear and concise
   - Reusable across contexts when possible
   - Free of sensitive or organization-specific information
   - Following best practices for AI interaction

### Contribution Process

1. **For major contributions:**
   - Fork the repository
   - Create a branch
   - Add your prompt following the template
   - Submit a PR with details about the prompt's purpose and value

2. **For minor improvements:**
   - Use GitHub's edit feature directly
   - Submit a PR with changes and explanation

3. **For prompt requests:**
   - Create an issue using the prompt request template
   - Include details about the desired prompt and use case

## 8. User Documentation

Create comprehensive documentation including:

1. **Getting Started Guide**
   - How to access the prompt library
   - Using the Slack commands
   - Finding the right prompt

2. **Contribution Guide**
   - Step-by-step PR creation process
   - Writing effective prompts
   - Prompt templates and examples

3. **Admin Guide**
   - Setting up the integration
   - Managing the repository
   - Handling webhook events

## 9. Advanced Features (Future Enhancements)

1. **Prompt Analytics**
   - Track prompt usage and popularity
   - Identify gaps in the library
   - Measure prompt effectiveness

2. **Automated Testing**
   - Test prompts against multiple AI models
   - Verify prompt quality and consistency
   - Flag prompts that need improvement

3. **Personal Collections**
   - Allow users to save favorite prompts
   - Create personal prompt collections
   - Share collections with teams

4. **Integration with AI Tools**
   - Direct integration with organizational AI assistants
   - One-click prompt application
   - Prompt chaining and workflows

## 10. Launch and Adoption Strategy

1. **Pilot Phase**
   - Select 1-2 teams for initial testing
   - Gather feedback and iterate
   - Seed the repository with team-specific prompts

2. **Organization-wide Launch**
   - Announcement in all-hands meeting
   - Training sessions for each department
   - Prompt creation contests or hackathons

3. **Ongoing Engagement**
   - Regular updates on new prompts
   - Featured prompt of the week in Slack
   - Recognition for top contributors

4. **Success Metrics**
   - Number of prompts contributed
   - Prompt library usage statistics
   - Time saved by reusing prompts
   - User satisfaction surveys 