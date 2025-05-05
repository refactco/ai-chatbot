/**
 * Formatter Utility Tests
 *
 * This file contains tests for utility formatting functions.
 * It demonstrates simple unit testing for pure functions.
 *
 * Features:
 * - Unit tests for pure functions
 * - Test cases with different inputs
 * - Testing with mock functions
 */

// Simple utility functions to test
const formatters = {
  /**
   * Truncates a string if it exceeds the maximum length
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns Truncated text with ellipsis if needed
   */
  truncateText: (text: string, maxLength: number): string => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  },

  /**
   * Formats a date as a readable string
   * @param date - Date to format
   * @param format - Optional format function
   * @returns Formatted date string
   */
  formatDate: (date: Date, format?: (date: Date) => string): string => {
    if (!date) return '';

    if (format) {
      return format(date);
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  },

  /**
   * Formats a number as currency
   * @param value - Number to format
   * @param currency - Currency code
   * @returns Formatted currency string
   */
  formatCurrency: (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },
};

describe('Formatter Utilities', () => {
  describe('truncateText', () => {
    test('returns empty string for null or undefined input', () => {
      expect(formatters.truncateText('', 10)).toBe('');
      expect(formatters.truncateText(null as any, 10)).toBe('');
      expect(formatters.truncateText(undefined as any, 10)).toBe('');
    });

    test('does not truncate text shorter than max length', () => {
      const text = 'Hello World';
      expect(formatters.truncateText(text, 20)).toBe(text);
    });

    test('truncates text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(formatters.truncateText(text, 10)).toBe('This is a ...');
    });
  });

  describe('formatDate', () => {
    test('returns empty string for null or undefined date', () => {
      expect(formatters.formatDate(null as any)).toBe('');
      expect(formatters.formatDate(undefined as any)).toBe('');
    });

    test('formats date with default formatting', () => {
      // Create a fixed date for testing (Jan 15, 2023)
      const testDate = new Date(2023, 0, 15);

      // The exact format may vary by environment, so we test for inclusion of components
      const formatted = formatters.formatDate(testDate);
      expect(formatted).toContain('2023');
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });

    test('uses custom formatter when provided', () => {
      const testDate = new Date(2023, 0, 15);
      const customFormatter = jest.fn().mockReturnValue('CUSTOM FORMAT');

      const result = formatters.formatDate(testDate, customFormatter);

      expect(result).toBe('CUSTOM FORMAT');
      expect(customFormatter).toHaveBeenCalledWith(testDate);
      expect(customFormatter).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatCurrency', () => {
    test('formats USD by default', () => {
      expect(formatters.formatCurrency(1234.56)).toBe('$1,234.56');
    });

    test('formats other currencies when specified', () => {
      expect(formatters.formatCurrency(1234.56, 'EUR')).toContain('1,234.56');
      expect(formatters.formatCurrency(1234.56, 'EUR')).toContain('€');
    });
  });
});
