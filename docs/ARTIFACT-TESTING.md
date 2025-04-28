# Artifact Testing Guide

This guide explains how to test the image, text, and sheet artifacts in the AI chatbot UI, including version control features.

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

## Version Control Testing

The artifact system includes a comprehensive version control system that you can test with these steps:

1. **Create Multiple Versions**:
   - Open any artifact (text works best for this test)
   - Make changes to the content and wait for auto-save
   - Make additional changes to create multiple versions
   - Observe the "Saving changes..." and "Updated X minutes ago" indicators

2. **Navigate Versions**:
   - Use the version navigation arrows in the toolbar (top-right)
   - Navigate backwards through version history
   - Note the version indicator showing your position (e.g., "2 / 5")
   - Observe that the content changes to show the historical version

3. **Compare Versions**:
   - While viewing a previous version, click the "diff/edit" toggle button
   - Switch between "edit" mode (view only) and "diff" mode
   - In diff mode, you should see content differences highlighted

4. **Restore Previous Versions**:
   - Navigate to an earlier version
   - Click "Restore this version" in the footer
   - Confirm that all later versions are removed
   - Verify you can now edit the restored version

## Storage System Testing

The artifact system uses two storage mechanisms that can be tested:

### API Storage Testing
By default, artifacts use the API storage system. This can be observed through network requests when:
- Loading an artifact
- Saving changes
- Navigating through versions
- Restoring previous versions

### Local Storage Testing
Special document IDs trigger the local storage system instead:

1. **Local Document Creation**:
   - Create an artifact with standard commands
   - In browser developer tools, open the Application tab
   - Check localStorage for keys starting with `local-document-`
   - Observe the JSON structure containing version history

2. **Local Storage Persistence**:
   - Make changes to a local document
   - Refresh the page
   - Verify that changes are preserved
   - Navigate through version history to confirm all versions were saved

3. **Local Document Restoration**:
   - Navigate to an earlier version of a local document
   - Click "Restore this version"
   - Observe the page reload
   - Verify that the restored version is now the latest version

## Debugging Version History

If you encounter issues with version history:

1. **Check Version Count**:
   - Look at the version indicator in the toolbar (e.g., "3 / 5")
   - Verify that the expected number of versions exists

2. **Inspect Local Storage**:
   - In browser developer tools, examine localStorage entries
   - Look for the document ID in the key name
   - Parse the JSON to view all versions and their timestamps

3. **Monitor Network Requests**:
   - For API-based documents, watch network requests
   - Check for status codes and responses
   - Verify document ID parameters in requests

4. **Console Logs**:
   - Version-related operations log to the console
   - Check for "Created new version" messages
   - Look for any errors during version operations

## Mobile Testing

Test artifact interactions on mobile devices:

1. **Mobile Layout**:
   - Verify that the artifact expands to full screen on mobile
   - Confirm that controls are accessible and properly sized
   - Test scrolling and zooming gestures

2. **Version Navigation**:
   - Verify that version controls work on mobile
   - Test version restoration on smaller screens
   - Confirm that messages are hidden on mobile view

## Implementation Details

The artifacts are implemented using a component architecture with:

1. **Artifact Definition** - Contains the artifact type, description, and handlers
2. **Content Component** - Renders the artifact content (editor, viewer, etc.)
3. **Actions** - Buttons for common actions like copy, view history, etc.
4. **Toolbar** - Additional tools for specific artifact types
5. **Version Control** - Components for managing and navigating versions

In the mock implementation, the artifacts are generated with sample content. In a real implementation, these would be generated based on AI responses.

## Troubleshooting

If artifacts don't appear:
1. Make sure you're using the exact phrase (e.g., "test image artifact")
2. Check the browser console for any errors
3. Refresh the page and try again

If version history isn't working:
1. Ensure you've made changes that trigger new versions
2. Wait for the "Saving changes..." indicator to clear
3. Check localStorage or network requests to confirm versions were created
4. Try using a different browser if issues persist

## Next Steps

After testing the basic artifacts and version control, you can:
1. Modify the sample content in `mock-api-service.ts` to test different scenarios
2. Add custom artifact actions
3. Test performance with large documents and many versions
4. Verify responsive behavior across different device sizes 