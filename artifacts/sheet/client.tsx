/**
 * Sheet Artifact Client Implementation
 *
 * This file defines the client-side implementation of the sheet artifact type.
 * It handles rendering, interaction, and state management for spreadsheet documents.
 *
 * Features:
 * - Spreadsheet editor integration
 * - Version history navigation
 * - CSV export functionality
 * - Data formatting and analysis tools
 * - Real-time streaming updates
 *
 * The sheet artifact is used for creating and editing spreadsheet data with
 * version control support, allowing users to analyze and visualize data.
 */

import { Artifact } from '@/components/create-artifact';
import {
  CopyIcon,
  LineChartIcon,
  RedoIcon,
  SparklesIcon,
  UndoIcon,
} from '@/components/icons';
import { SpreadsheetEditor } from '@/components/sheet-editor';
import { parse, unparse } from 'papaparse';
import { toast } from 'sonner';

/**
 * Type definition for sheet metadata
 * Currently flexible to support various metadata types
 */
type Metadata = any;

/**
 * Sheet Artifact definition
 *
 * Creates a new sheet artifact type with specific behaviors and UI components
 */
export const sheetArtifact = new Artifact<'sheet', Metadata>({
  kind: 'sheet',
  description: 'Useful for working with spreadsheets',

  /**
   * Initializes a sheet artifact
   * Currently empty but can be extended for future metadata initialization
   */
  initialize: async () => {},

  /**
   * Handles streaming updates to the sheet artifact
   * Processes sheet content updates from the server
   */
  onStreamPart: ({ setArtifact, streamPart }) => {
    if (streamPart.type === 'sheet-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible: true,
        status: 'streaming',
      }));
    }
  },

  /**
   * Renders the sheet artifact content
   * Uses the SpreadsheetEditor component to display the data
   */
  content: ({
    content,
    currentVersionIndex,
    isCurrentVersion,
    onSaveContent,
    status,
  }) => {
    return (
      <SpreadsheetEditor
        content={content}
        currentVersionIndex={currentVersionIndex}
        isCurrentVersion={isCurrentVersion}
        saveContent={onSaveContent}
        status={status}
      />
    );
  },

  /**
   * Action buttons displayed in the sheet artifact interface
   * Provides version navigation and CSV export functionality
   */
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon />,
      description: 'Copy as .csv',
      onClick: ({ content }) => {
        // Parse the sheet content into a data structure
        const parsed = parse<string[]>(content, { skipEmptyLines: true });

        // Filter out completely empty rows
        const nonEmptyRows = parsed.data.filter((row) =>
          row.some((cell) => cell.trim() !== ''),
        );

        // Convert back to CSV format
        const cleanedCsv = unparse(nonEmptyRows);

        // Copy to clipboard
        navigator.clipboard.writeText(cleanedCsv);
        toast.success('Copied csv to clipboard!');
      },
    },
  ],

  /**
   * Toolbar buttons for data enhancement
   * Provides quick access to common spreadsheet operations
   */
  toolbar: [
    {
      description: 'Format and clean data',
      icon: <SparklesIcon />,
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Can you please format and clean the data?',
        });
      },
    },
    {
      description: 'Analyze and visualize data',
      icon: <LineChartIcon />,
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Can you please analyze and visualize the data by creating a new code artifact in python?',
        });
      },
    },
  ],
});
