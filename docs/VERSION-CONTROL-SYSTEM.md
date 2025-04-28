# Version Control System

This document provides detailed information about the version control system implemented for artifacts in the AI Chatbot application.

## Overview

The version control system allows users to track changes to artifacts over time, navigate between versions, and restore previous states. This system works seamlessly with both API-based storage and local browser storage, providing a consistent user experience regardless of the underlying storage mechanism.

## Core Components

The version control system consists of several key components:

1. **Artifact Component** (`components/artifact.tsx`):
   - Main controller for version management
   - Handles document fetching and updating
   - Implements version navigation logic

2. **VersionFooter** (`components/version-footer.tsx`):
   - UI for version restoration
   - Displays version status information
   - Provides navigation controls

3. **ArtifactActions** (`components/artifact-actions.tsx`):
   - Toolbar controls for version navigation
   - Toggle between edit and diff modes
   - Version selection interface

## Version Storage

### API-Based Version Storage

When working with server-side documents:

1. **Fetching Versions**:
   ```typescript
   const { data: apiDocuments } = useSWR<Array<Document>>(
     `/api/document?id=${actualDocumentId}`,
     fetcher
   );
   ```

2. **Creating New Versions**:
   ```typescript
   await fetch(`/api/document?id=${artifact.documentId}`, {
     method: 'POST',
     body: JSON.stringify({
       title: artifact.title,
       content: updatedContent,
       kind: artifact.kind,
     }),
   });
   ```

3. **Restoring Versions**:
   ```typescript
   await fetch(
     `/api/document?id=${artifact.documentId}&timestamp=${timestamp}`,
     { method: 'DELETE' }
   );
   ```

### Local Storage Version System

For development or special document types (prefixed with `local:`, `text:`, `sheet:`, etc.):

1. **Storage Format**:
   ```typescript
   interface Document {
     id: string;
     kind: string;
     title: string;
     content: string;
     createdAt: Date;
     updatedAt: Date;
     userId: string;
   }
   ```

2. **LocalStorage Key Structure**:
   ```typescript
   const localStorageKey = `local-document-${actualDocumentId}`;
   ```

3. **Loading Versions**:
   ```typescript
   const storedData = localStorage.getItem(localStorageKey);
   if (storedData) {
     const parsedData = JSON.parse(storedData) as Document[];
     return parsedData;
   }
   ```

4. **Creating Versions**:
   ```typescript
   const newDocument = {
     id: actualDocumentId,
     kind: artifact.kind,
     title: artifact.title,
     content: updatedContent,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 'local-user',
   };
   
   localStorage.setItem(
     localStorageKey, 
     JSON.stringify([...currentDocuments, newDocument])
   );
   ```

5. **Restoring Versions**:
   ```typescript
   // Filter versions to keep only those before the selected timestamp
   const restoredVersions = documents.filter(
     (doc) => !isAfter(new Date(doc.createdAt), selectedTimestamp)
   );
   localStorage.setItem(localStorageKey, JSON.stringify(restoredVersions));
   ```

## Version Navigation

### Current Version Identification

The system determines the current version status with:

```typescript
const isCurrentVersion =
  documents && documents.length > 0
    ? currentVersionIndex === documents.length - 1
    : true;
```

### Version Navigation Logic

```typescript
const handleVersionChange = (type: 'next' | 'prev' | 'toggle' | 'latest') => {
  if (!documents) return;

  if (type === 'latest') {
    setCurrentVersionIndex(documents.length - 1);
    setMode('edit');
  }

  if (type === 'toggle') {
    setMode((mode) => (mode === 'edit' ? 'diff' : 'edit'));
  }

  if (type === 'prev') {
    if (currentVersionIndex > 0) {
      setCurrentVersionIndex((index) => index - 1);
    }
  } else if (type === 'next') {
    if (currentVersionIndex < documents.length - 1) {
      setCurrentVersionIndex((index) => index + 1);
    }
  }
};
```

## Content Editing and Version Creation

### Debounced Content Saving

To prevent excessive version creation, edits are debounced:

```typescript
const debouncedHandleContentChange = useDebounceCallback(
  handleContentChange,
  1000
);

const saveContent = (updatedContent: string, debounce: boolean) => {
  setIsContentDirty(true);
  
  if (document && updatedContent !== document.content) {
    if (debounce) {
      debouncedHandleContentChange(updatedContent);
    } else {
      handleContentChange(updatedContent);
    }
  } else {
    setTimeout(() => setIsContentDirty(false), 500);
  }
};
```

### Visual Feedback

The system provides visual feedback during saves:

```tsx
{isContentDirty ? (
  <div className="text-sm text-muted-foreground">
    Saving changes...
  </div>
) : document ? (
  <div className="text-sm text-muted-foreground">
    {`Updated ${formatDistance(
      new Date(document.createdAt),
      new Date(),
      { addSuffix: true }
    )}`}
  </div>
) : (
  <div className="w-32 h-3 mt-2 bg-muted-foreground/20 rounded-md animate-pulse" />
)}
```

## Version Comparison

### Diff Mode

The system supports switching between edit and diff modes:

```typescript
const [mode, setMode] = useState<'edit' | 'diff'>('edit');
```

When in diff mode, content viewers can display differences between versions. The exact implementation varies by artifact type.

### Content Access for Comparison

To compare versions, the system provides content access functions:

```typescript
function getDocumentContentById(index: number) {
  if (!documents) return '';
  if (!documents[index]) return '';
  return documents[index].content ?? '';
}
```

## Version Restoration

### API-Based Restoration

For server-stored documents:

```typescript
mutate(
  `/api/document?id=${artifact.documentId}`,
  await fetch(
    `/api/document?id=${artifact.documentId}&timestamp=${timestamp}`,
    { method: 'DELETE' }
  ),
  { optimisticData: filteredDocuments }
);
```

### Local Storage Restoration

For locally stored documents:

```typescript
// Filter to keep only versions before the selected timestamp
const restoredVersions = documents.filter(
  (doc) => !isAfter(new Date(doc.createdAt), selectedTimestamp)
);

// Update local storage
localStorage.setItem(localStorageKey, JSON.stringify(restoredVersions));

// Reload to apply changes
window.location.reload();
```

## User Interface Components

### Version Navigation Controls

Version navigation is provided through UI controls:

```tsx
<Button
  size="icon"
  variant="ghost"
  onClick={() => handleVersionChange('prev')}
  disabled={currentVersionIndex <= 0}
>
  <ChevronLeftIcon className="h-4 w-4" />
</Button>

<div className="text-xs text-muted-foreground">
  {currentVersionIndex + 1} / {documents.length}
</div>

<Button
  size="icon"
  variant="ghost"
  onClick={() => handleVersionChange('next')}
  disabled={isCurrentVersion}
>
  <ChevronRightIcon className="h-4 w-4" />
</Button>
```

### Version Footer

When viewing a previous version, a footer appears:

```tsx
<VersionFooter
  currentVersionIndex={currentVersionIndex}
  documents={documents}
  handleVersionChange={handleVersionChange}
/>
```

The footer provides context and restoration controls:

```tsx
<div>
  <div>You are viewing a previous version</div>
  <div className="text-muted-foreground text-sm">
    Restore this version to make edits
  </div>
</div>

<div className="flex flex-row gap-4">
  <Button onClick={handleRestore}>
    Restore this version
  </Button>
  <Button 
    variant="outline"
    onClick={() => handleVersionChange('latest')}
  >
    Back to latest version
  </Button>
</div>
```

## Integration with Artifact Types

Each artifact type (text, image, sheet) implements its own content viewing and editing mechanism, but the version control system remains consistent across all types. This is achieved through the artifact definition interface:

```typescript
export const artifactDefinitions = [
  textArtifact, 
  imageArtifact, 
  sheetArtifact
];

// Content rendering based on artifact type
<artifactDefinition.content
  title={artifact.title}
  content={
    isCurrentVersion
      ? artifact.content
      : getDocumentContentById(currentVersionIndex)
  }
  mode={mode}
  status={artifact.status}
  currentVersionIndex={currentVersionIndex}
  isCurrentVersion={isCurrentVersion}
  getDocumentContentById={getDocumentContentById}
  onSaveContent={saveContent}
  // ...other props
/>
```

## Future Enhancements

Planned improvements to the version control system:

1. **Enhanced Diff Visualization**: Improved visual representation of changes between versions
2. **Version Annotations**: Allow users to add notes to specific versions
3. **Selective Version Restoration**: Restore specific changes rather than entire versions
4. **Branching Support**: Allow creating alternative branches of development
5. **Collaborative Editing**: Real-time version control with multiple users

## Best Practices

When working with the version control system:

1. **Regular Saving**: The system automatically saves changes, but manual saves can be triggered
2. **Version Navigation**: Use the UI controls to navigate between versions
3. **Restore with Care**: Restoring a version removes all subsequent versions
4. **Check Version Status**: Note the version indicator to know if you're viewing the latest version
5. **Use Diff Mode**: When reviewing changes, toggle to diff mode for better visibility 