// This script generates a prompt-index.json file that contains metadata about all prompts in the repository
// Run it with Node.js before deploying the site to GitHub Pages

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const PROMPTS_DIR = '../prompts';
const OUTPUT_FILE = './prompt-index.json';

// Maps for categorizing prompts
const typeMap = {
    'templates': 'template',
    'domains': 'feature',
    'technologies': 'template',
    'use-cases': 'use-case'
};

// Parse prompt content to extract metadata
function parsePromptContent(content) {
    const titleMatch = content.match(/^# (.*)/m);
    const descriptionMatch = content.match(/## Description\s+(.*?)(?=##)/s);
    const tagsMatch = content.match(/## Tags\s+([\s\S]*?)(?=##)/s);
    const contributorMatch = content.match(/## Contributed By\s+(.*?)(?=##|$)/s);
    
    // Improved extraction of the prompt section with more robust pattern matching
    const promptMatch = content.match(/## Prompt\s+([\s\S]*?)(?=(##|$))/s);
    
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Prompt';
    const description = descriptionMatch ? descriptionMatch[1].trim() : 'No description available';
    
    // Extract the actual prompt text, removing code block markers
    let promptText = '';
    if (promptMatch) {
        promptText = promptMatch[1].trim();
        // If the prompt is in a code block (```), extract just the content inside
        const codeBlockMatch = promptText.match(/```(?:.*?)\n([\s\S]*?)```/);
        if (codeBlockMatch) {
            promptText = codeBlockMatch[1].trim();
        }
    }
    
    let tags = [];
    if (tagsMatch) {
        tags = tagsMatch[1].split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
    }

    let contributor = 'Unknown';
    if (contributorMatch) {
        contributor = contributorMatch[1].trim();
    }

    return {
        title,
        description,
        tags,
        contributor,
        promptText,
        fullContent: content  // Include the full content
    };
}

// Determine section and type from path
function getMetadataFromPath(filePath) {
    // Get the relative path from the prompts directory
    // This already gives us the path inside the prompts directory (e.g. 'domains/engineering/code-review.md')
    const relativePart = path.relative(PROMPTS_DIR, filePath);
    
    // Add a leading slash to make it an absolute path from root
    const relativePath = '/' + relativePart;
    
    // The first segment of the relative path is the section
    const section = relativePart.split('/')[0];
    
    // Determine type based on section
    const type = typeMap[section] || 'feature';
    
    return {
        path: relativePath,
        section,
        type
    };
}

// Check if a file is a valid prompt file
function isValidPromptFile(filePath) {
    // Get filename and check if it's a README.md
    const basename = path.basename(filePath).toLowerCase();
    
    // Exclude README.md files
    if (basename === 'readme.md') {
        console.log(`Skipping README file: ${filePath}`);
        return false;
    }
    
    // Exclude template files from templates directory
    if (filePath.includes('/templates/') && 
        (basename === 'basic-template.md' || basename === 'advanced-template.md')) {
        console.log(`Skipping template file: ${filePath}`);
        return false;
    }
    
    // Additional validation can be added here
    // For example, validate that the file contains required prompt sections
    const content = fs.readFileSync(filePath, 'utf8');
    const hasDescription = content.includes('## Description');
    const hasPromptSection = content.includes('## Prompt');
    
    if (!hasDescription || !hasPromptSection) {
        console.log(`Skipping invalid prompt file (missing required sections): ${filePath}`);
        return false;
    }
    
    return true;
}

// Main function
async function generatePromptIndex() {
    try {
        // Get all markdown files in the prompts directory
        const files = glob.sync(`${PROMPTS_DIR}/**/*.md`);
        console.log(`Found ${files.length} total markdown files`);
        
        // Filter out README.md files and validate prompt files
        const validPromptFiles = files.filter(isValidPromptFile);
        console.log(`Identified ${validPromptFiles.length} valid prompt files`);
        
        // Parse each file
        const prompts = validPromptFiles.map(file => {
            const content = fs.readFileSync(file, 'utf8');
            const metadata = parsePromptContent(content);
            const pathMetadata = getMetadataFromPath(file);
            
            // Get the prompt ID from filename for easier reference
            const filenameWithoutExt = path.basename(file, '.md');
            const id = filenameWithoutExt.toLowerCase().replace(/\s+/g, '-');
            
            return {
                id,
                ...pathMetadata,
                ...metadata
            };
        });
        
        // Write the index file
        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2));
        console.log(`Successfully generated ${OUTPUT_FILE} with ${prompts.length} prompts.`);
    } catch (error) {
        console.error('Error generating prompt index:', error);
    }
}

// Run the generator
generatePromptIndex(); 