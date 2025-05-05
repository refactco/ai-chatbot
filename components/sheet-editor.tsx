/**
 * Sheet Editor Component
 *
 * This component provides a spreadsheet interface for creating and editing tabular data.
 * Features:
 * - Interactive data grid with Excel-like rows and columns
 * - CSV data parsing and serialization for compatibility
 * - Version control integration with read-only mode for historical versions
 * - Dark and light theme compatibility
 * - Auto-save functionality with debounced content changes
 * - Visual indicators for current editing state
 * - Performance optimizations with memoization
 *
 * The component serves as the primary editor for sheet artifacts and maintains
 * compatibility with the artifact version control system for consistent user experience.
 */

'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { parse, unparse } from 'papaparse';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import DataGrid, { textEditor } from 'react-data-grid';

import 'react-data-grid/lib/styles.css';

/**
 * Props definition for the SheetEditor component
 * @property content - CSV content as string to display in the grid
 * @property saveContent - Function to save content changes with debounce option
 * @property status - Current status of the editor (streaming/idle)
 * @property isCurrentVersion - Whether displaying the latest version
 * @property currentVersionIndex - Index of the currently displayed version
 */
type SheetEditorProps = {
  content: string;
  saveContent: (content: string, debounce: boolean) => void;
  status: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
};

// Constants for minimum grid dimensions
const MIN_ROWS = 50;
const MIN_COLS = 26;

const PureSpreadsheetEditor = ({
  content,
  saveContent,
  status,
  isCurrentVersion,
  currentVersionIndex,
}: SheetEditorProps) => {
  const { theme } = useTheme();
  const [lastSavedContent, setLastSavedContent] = useState(content);

  // Debug logging for component lifecycle and props changes
  // useEffect(() => {
  //   console.log('SpreadsheetEditor rendering with:', {
  //     contentLength: content?.length,
  //     isCurrentVersion,
  //     currentVersionIndex,
  //     status,
  //   });
  // }, [content, isCurrentVersion, currentVersionIndex, status]);

  /**
   * Parses CSV content into grid data structure
   * Ensures minimum dimensions are maintained regardless of input
   * Handles empty content with default empty grid
   */
  const parseData = useMemo(() => {
    if (!content) return Array(MIN_ROWS).fill(Array(MIN_COLS).fill(''));
    try {
      const result = parse<string[]>(content, { skipEmptyLines: true });

      // Ensure data has minimum number of columns and rows
      const paddedData = result.data.map((row) => {
        const paddedRow = [...row];
        while (paddedRow.length < MIN_COLS) {
          paddedRow.push('');
        }
        return paddedRow;
      });

      while (paddedData.length < MIN_ROWS) {
        paddedData.push(Array(MIN_COLS).fill(''));
      }

      return paddedData;
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      return Array(MIN_ROWS).fill(Array(MIN_COLS).fill(''));
    }
  }, [content]);

  /**
   * Generates column definitions for the data grid
   * Includes row number column and A-Z data columns
   * Applies proper styling based on current theme
   */
  const columns = useMemo(() => {
    // Row number column (frozen leftmost column)
    const rowNumberColumn = {
      key: 'rowNumber',
      name: '',
      frozen: true,
      width: 50,
      renderCell: ({ rowIdx }: { rowIdx: number }) => rowIdx + 1,
      cellClass: 'border-t border-r dark:bg-zinc-950 dark:text-zinc-50',
      headerCellClass: 'border-t border-r dark:bg-zinc-900 dark:text-zinc-50',
    };

    // Data columns (A-Z)
    const dataColumns = Array.from({ length: MIN_COLS }, (_, i) => ({
      key: i.toString(),
      name: String.fromCharCode(65 + i),
      renderEditCell: textEditor,
      width: 120,
      cellClass: cn(`border-t dark:bg-zinc-950 dark:text-zinc-50`, {
        'border-l': i !== 0,
      }),
      headerCellClass: cn(`border-t dark:bg-zinc-900 dark:text-zinc-50`, {
        'border-l': i !== 0,
      }),
    }));

    return [rowNumberColumn, ...dataColumns];
  }, []);

  /**
   * Converts parsed data into row format expected by react-data-grid
   * Maps CSV data to object structure with row IDs and column keys
   */
  const initialRows = useMemo(() => {
    return parseData.map((row, rowIndex) => {
      const rowData: any = {
        id: rowIndex,
        rowNumber: rowIndex + 1,
      };

      columns.slice(1).forEach((col, colIndex) => {
        rowData[col.key] = row[colIndex] || '';
      });

      return rowData;
    });
  }, [parseData, columns]);

  const [localRows, setLocalRows] = useState(initialRows);

  // Reset rows when content changes (e.g., when version changes)
  useEffect(() => {
    setLocalRows(initialRows);
    setLastSavedContent(content);
  }, [initialRows, content]);

  /**
   * Converts grid data back to CSV format for saving
   * @param data - 2D array of cell values to convert to CSV
   * @returns CSV formatted string
   */
  const generateCsv = useCallback((data: any[][]) => {
    const csv = unparse(data);
    return csv;
  }, []);

  /**
   * Handles row changes in the data grid
   * Converts updated rows to CSV and triggers save if content changed
   * Respects read-only mode for historical versions
   */
  const handleRowsChange = useCallback(
    (newRows: any[]) => {
      if (!isCurrentVersion) {
        return;
      }

      setLocalRows(newRows);

      // Convert rows back to 2D array format for CSV generation
      const updatedData = newRows.map((row) => {
        return columns.slice(1).map((col) => row[col.key] || '');
      });

      const newCsvContent = generateCsv(updatedData);

      // Only save if content has actually changed
      if (newCsvContent !== lastSavedContent) {
        setLastSavedContent(newCsvContent);
        saveContent(newCsvContent, true);
      }
    },
    [columns, generateCsv, isCurrentVersion, lastSavedContent, saveContent],
  );

  // If not the current version, display in read-only mode
  const isReadOnly = !isCurrentVersion;

  return (
    <div className="size-full relative">
      {/* Version indicator badge for non-current versions */}
      {isReadOnly && (
        <div className="absolute top-0 right-0 z-10 bg-yellow-500 text-black px-2 py-1 text-xs rounded-bl m-1">
          Read-only: Viewing version {currentVersionIndex}
        </div>
      )}
      <DataGrid
        className={theme === 'dark' ? 'rdg-dark' : 'rdg-light'}
        columns={columns}
        rows={localRows}
        enableVirtualization
        onRowsChange={isReadOnly ? undefined : handleRowsChange}
        onCellClick={(args) => {
          if (!isReadOnly && args.column.key !== 'rowNumber') {
            args.selectCell(true);
          }
        }}
        style={{ height: '100%' }}
        defaultColumnOptions={{
          resizable: true,
          sortable: true,
        }}
      />
    </div>
  );
};

/**
 * Custom equality check for memoization optimization
 * Prevents unnecessary rerenders when props haven't changed significantly
 * Logs reasons for re-rendering to help with debugging
 */
function areEqual(prevProps: SheetEditorProps, nextProps: SheetEditorProps) {
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex) {
    return false;
  }
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) {
    return false;
  }
  if (prevProps.status !== nextProps.status) {
    return false;
  }
  if (prevProps.content !== nextProps.content) {
    return false;
  }
  return true;
}

// Export memoized component for performance optimization
export const SpreadsheetEditor = memo(PureSpreadsheetEditor, areEqual);
