'use client';

import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import DataGrid, { textEditor } from 'react-data-grid';
import { parse, unparse } from 'papaparse';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import 'react-data-grid/lib/styles.css';

type SheetEditorProps = {
  content: string;
  saveContent: (content: string, debounce: boolean) => void;
  status: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
};

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

  // Debug logging
  useEffect(() => {
    console.log('SpreadsheetEditor rendering with:', {
      contentLength: content?.length,
      isCurrentVersion,
      currentVersionIndex,
      status,
    });
  }, [content, isCurrentVersion, currentVersionIndex, status]);

  const parseData = useMemo(() => {
    if (!content) return Array(MIN_ROWS).fill(Array(MIN_COLS).fill(''));

    console.log('Parsing content of length:', content.length);
    try {
      const result = parse<string[]>(content, { skipEmptyLines: true });

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

  const columns = useMemo(() => {
    const rowNumberColumn = {
      key: 'rowNumber',
      name: '',
      frozen: true,
      width: 50,
      renderCell: ({ rowIdx }: { rowIdx: number }) => rowIdx + 1,
      cellClass: 'border-t border-r dark:bg-zinc-950 dark:text-zinc-50',
      headerCellClass: 'border-t border-r dark:bg-zinc-900 dark:text-zinc-50',
    };

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

  // Reset rows when content changes (e.g., version changes)
  useEffect(() => {
    console.log('Content changed, resetting rows');
    setLocalRows(initialRows);
    setLastSavedContent(content);
  }, [initialRows, content]);

  const generateCsv = useCallback((data: any[][]) => {
    const csv = unparse(data);
    console.log('Generated CSV of length:', csv.length);
    return csv;
  }, []);

  const handleRowsChange = useCallback(
    (newRows: any[]) => {
      if (!isCurrentVersion) {
        console.log('Ignoring changes in view-only mode');
        return;
      }

      setLocalRows(newRows);

      const updatedData = newRows.map((row) => {
        return columns.slice(1).map((col) => row[col.key] || '');
      });

      const newCsvContent = generateCsv(updatedData);

      // Only save if content has actually changed
      if (newCsvContent !== lastSavedContent) {
        console.log('Content changed, saving...');
        setLastSavedContent(newCsvContent);
        saveContent(newCsvContent, true);
      }
    },
    [columns, generateCsv, isCurrentVersion, lastSavedContent, saveContent],
  );

  // If not the current version, display a read-only view
  const isReadOnly = !isCurrentVersion;

  return (
    <div className="h-full w-full relative">
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

function areEqual(prevProps: SheetEditorProps, nextProps: SheetEditorProps) {
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex) {
    console.log(
      'Version changed from',
      prevProps.currentVersionIndex,
      'to',
      nextProps.currentVersionIndex,
    );
    return false;
  }
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) {
    console.log(
      'isCurrentVersion changed from',
      prevProps.isCurrentVersion,
      'to',
      nextProps.isCurrentVersion,
    );
    return false;
  }
  if (prevProps.status !== nextProps.status) {
    console.log(
      'Status changed from',
      prevProps.status,
      'to',
      nextProps.status,
    );
    return false;
  }
  if (prevProps.content !== nextProps.content) {
    console.log('Content changed');
    return false;
  }
  return true;
}

export const SpreadsheetEditor = memo(PureSpreadsheetEditor, areEqual);
