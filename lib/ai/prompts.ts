// This is a stub implementation that replaces the AI package dependency
// Replace with your actual prompt implementations

// For sheet artifacts
export const sheetPrompt = `Create a spreadsheet with the following data:`;

// For code artifacts
export const codePrompt = `Generate code based on the following requirements:`;

// For document updates
export function updateDocumentPrompt(content: string, kind: string): string {
  return `Update the ${kind} document with the following changes:
  
Current content:
${content}

Changes to make:`;
}

// Add any other prompts needed by your application
