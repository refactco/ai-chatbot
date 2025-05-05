# Version Control System

## Overview

This document details the version control system implemented in the AI Chatbot application, which allows users to track changes, restore previous versions, and compare differences between artifact versions.

The version control system is a key feature of the artifact system, providing a robust way to manage document history across different storage backends (API and localStorage).

## Core Components

### VersionFooter (`components/version-footer.tsx`)

- **Description**: UI component for version navigation
- **Features**:
  - Displays version history with timestamps
  - Shows current version position within history
  - Provides controls to navigate between versions
  - Enables version restoration

### Artifact Component (`components/artifact.tsx`)

- **Description**: Manages version state and storage
- **Relevant Functions**:
  - `handleVersionChange()`: Navigates between versions
  - `handleContentChange()`: Creates new versions on edit
  - `saveContent()`: Debounced save with version creation
  - `loadLocalDocuments()`: Loads versioned documents from localStorage

### ArtifactActions (`components/artifact-actions.tsx`)

- **Description**: Action buttons for version control
- **Features**:
  - Toggle diff view between versions
  - Navigate to latest version
  - Export current version

## Version Storage

### API-Based Storage

- **Description**: Server-based storage for production
- **Implementation Details**:
  - Documents stored at `/api/document?id=${documentId}`
  - Each edit creates a new version in the array
  - Uses SWR for data fetching and mutations
  - Optimistic updates for immediate feedback
  - API handles authentication and persistence

### LocalStorage-Based Storage

- **Description**: Client-side storage for development
- **Implementation Details**:
  - Documents stored with key format: `local-document-${documentId}`
  - Each document is an array of versions
  - Structured identically to API-based documents
  - Persistence handled through browser localStorage
  - Automatic detection of storage type based on document ID

## Version Structure

### Document Array

- Each document ID is associated with an array of document versions
- Each version includes:
  - **id**: Document identifier
  - **kind**: Artifact type (text, image, sheet)
  - **title**: Document title
  - **content**: Document content
  - **createdAt**: Timestamp of version creation
  - **updatedAt**: Last update timestamp
  - **userId**: User who created the version

### Version Navigation

- The current version index is tracked in component state
- Navigation operations:
  - Previous version: `currentVersionIndex - 1`
  - Next version: `currentVersionIndex + 1`
  - Latest version: `documents.length - 1`

## Core Functionality

### Version Creation

- **Trigger**: Content changes in the artifact editor
- **Process**:
  1. Content changes are detected in editors
  2. Changes are debounced to prevent excessive versions
  3. New version is created with current timestamp
  4. Version is added to document history array
  5. UI indicates saving status during the process

### Version Comparison (Diff Mode)

- **Toggle**: Via toolbar or version navigation action
- **States**:
  - **Edit Mode**: Normal editing of current version
  - **Diff Mode**: Compare current version with another
- **Implementation**:
  - UI adapts to show version comparison
  - Both previous and current content are displayed
  - Special styling indicates differences

### Version Restoration

- **Process**:
  1. User navigates to a previous version
  2. User initiates restoration action
  3. Previous version content becomes current content
  4. New version is created with restored content
  5. UI returns to edit mode with the restored content

## User Experience

### Visual Indicators

- **Saving Status**: Shows when content is being saved
- **Version Information**: Displays "Updated X time ago"
- **Version Position**: Shows current version in relation to history
- **Content Changes**: Indicates unsaved changes

### Animations

- Smooth transitions between versions
- Animated version footer appearance/disappearance
- Visual feedback during version operations

## Implementation Details

### Version Detection

```typescript
const isCurrentVersion =
  documents && documents.length > 0
    ? currentVersionIndex === documents.length - 1
    : true;
```

### Debounced Saving

```typescript
const debouncedHandleContentChange = useDebounceCallback(
  handleContentChange,
  1000, // Debounce time for version creation
);
```

### Version Creation Sample

```typescript
// For local documents
if (useLocalDocument) {
  setLocalDocuments((currentDocuments) => {
    if (!currentDocuments) return undefined;

    const newDocument = {
      id: actualDocumentId,
      kind: artifact.kind as ArtifactKind,
      title: artifact.title,
      content: updatedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'local-user',
    };

    return [...currentDocuments, newDocument];
  });
}
```

## Special Cases

### Initial Version

- When a document is first created, an initial version is automatically generated
- This serves as the starting point for version history

### Read-Only Artifacts

- Some artifacts may be read-only (for example, during streaming)
- Version control UI adapts to show history without editing options

### Storage Switching

- The system automatically detects which storage backend to use
- The same version control UI works seamlessly across both backends

## Future Enhancements

### Planned Improvements

- **Enhanced Diff Visualization**: Improved visualization of changes between versions
- **Branching**: Allow multiple parallel version histories
- **Named Versions**: Support for user-defined version names/tags
- **Version Comments**: Add comments to explain changes in specific versions
- **Collaborative Editing**: Real-time version control with multiple users
- **Conflict Resolution**: Smart handling of concurrent edits
- **Export Options**: Export specific versions or version histories

## Related Documentation

- **Artifact System**: See `docs/ARTIFACT-SYSTEM.md` for the broader artifact system
- **Component Architecture**: See `docs/COMPONENT-ARCHITECTURE.md` for component relationships
- **Testing**: See `docs/ARTIFACT-TESTING.md` for testing version control features
