# Artifact Testing Guide

This guide explains how to test the image, text, and sheet artifacts in the AI chatbot UI.

## Overview

The AI chatbot supports three types of artifacts:
1. **Text Artifacts** - For text content like essays, documentation, etc.
2. **Image Artifacts** - For generated images
3. **Sheet Artifacts** - For spreadsheet data

## Testing the Artifacts

To test these artifacts, we've added special commands to the mock API service. Simply enter the following phrases in the chat input:

### Text Artifact
```
test text artifact
```
This will generate a sample markdown document that you can edit in the text editor interface.

### Image Artifact
```
test image artifact
```
This will generate a sample image that you can view and interact with.

### Sheet Artifact
```
test sheet artifact
```
This will generate a sample spreadsheet that you can edit and interact with.

## Artifact Features

Each artifact type supports different features:

### Text Artifact Features
- Real-time editing
- Version history
- Markdown formatting
- Text suggestions (limited in mock mode)

### Image Artifact Features
- Image viewing
- Copy to clipboard
- Version history (if multiple versions are created)

### Sheet Artifact Features
- Spreadsheet editing
- Copy as CSV
- Format and clean data (simulated in mock mode)
- Analyze data (simulated in mock mode)

## Implementation Details

The artifacts are implemented using a component architecture with:

1. **Artifact Definition** - Contains the artifact type, description, and handlers
2. **Content Component** - Renders the artifact content (editor, viewer, etc.)
3. **Actions** - Buttons for common actions like copy, view history, etc.
4. **Toolbar** - Additional tools for specific artifact types

In the mock implementation, the artifacts are generated with sample content. In a real implementation, these would be generated based on AI responses.

## Troubleshooting

If artifacts don't appear:
1. Make sure you're using the exact phrase (e.g., "test image artifact")
2. Check the browser console for any errors
3. Refresh the page and try again

## Next Steps

After testing the basic artifacts, you can:
1. Modify the sample content in `mock-api-service.ts` to test different scenarios
2. Add custom artifact actions
3. Integrate with real AI services for artifact generation 