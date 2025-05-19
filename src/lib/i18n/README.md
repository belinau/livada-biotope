# Internationalization (i18n) Utilities

This directory contains a collection of utilities for handling internationalization in the Livada Biotope application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Routing](#routing)
  - [Dates](#dates)
  - [Numbers](#numbers)
  - [Pluralization](#pluralization)
  - [Text Handling](#text-handling)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Installation

These utilities are designed to work with Next.js and the App Router. Make sure you have the following dependencies installed:

```bash
npm install next-intl @formatjs/intl-localematcher @formatjs/intl-displaynames
```

## Usage

### Routing

Handles locale-aware routing and URL generation.

```typescript
import { localizePathname, getLocaleFromPathname } from './routing';

// Add locale to a pathname
const path = localizePathname('/about', 'sl'); // '/sl/about'


// Get locale from pathname
const locale = getLocaleFromPathname('/sl/about'); // 'sl'
```

### Dates

Formats dates, times, and date ranges according to locale rules.

```typescript
import { formatDate, formatDateRange, getRelativeTimeString } from './date';

// Format a date
const date = new Date('2023-05-15');
const formatted = formatDate(date, 'long', 'sl'); // '15. maj 2023'

// Format a date range
const start = new Date('2023-05-15');
const end = new Date('2023-05-17');
const range = formatDateRange(start, end, 'long', 'sl'); // '15.-17. maj 2023'

// Get relative time
const timeAgo = getRelativeTimeString('2023-05-10', 'en'); // '5 days ago'
```

### Numbers

Formats numbers, currencies, and units according to locale rules.

```typescript
import { formatNumber, formatCurrency, formatPercent } from './number';

// Format a number
const num = 1234.56;
const formatted = formatNumber(num, { maximumFractionDigits: 1 }, 'sl'); // '1.234,6'

// Format as currency
const price = formatCurrency(19.99, 'EUR', {}, 'sl'); // '19,99 €'

// Format as percentage
const percent = formatPercent(0.123, {}, 'sl'); // '12 %'
```

### Pluralization

Handles plural forms and ordinal numbers.

```typescript
import { pluralize, formatOrdinal } from './plural';

// Simple pluralization
const count = 5;
const message = pluralize(count, { one: 'item', other: 'items' }, 'en'); // 'items'

// With template
const template = pluralize(count, { one: '{count} item', other: '{count} items' }, 'en');
// '5 items'

// Ordinal numbers
const ord = formatOrdinal(3, 'en'); // '3rd'
```

### Text Handling

Handles text direction, truncation, and other text transformations.

```typescript
import { getTextDirection, truncateText, toTitleCase } from './text';

// Get text direction
const dir = getTextDirection('ar'); // 'rtl'

// Truncate text
const text = 'This is a long text that needs to be truncated';
const short = truncateText(text, 20, 'en'); // 'This is a long text…'

// Title case
const title = toTitleCase('hello world', 'en'); // 'Hello World'
```

## API Reference

### Routing

- `localizePathname(pathname: string, locale: string): string` - Adds or replaces the locale in a pathname
- `getLocaleFromPathname(pathname: string): string` - Extracts the locale from a pathname
- `getPathnameWithoutLocale(pathname: string): string` - Removes the locale prefix from a pathname

### Dates

- `formatDate(date: Date | string | number, style?: DateStyle, locale?: string): string` - Formats a date
- `formatDateRange(start: Date | string | number, end: Date | string | number, style?: DateStyle, locale?: string): string` - Formats a date range
- `getRelativeTimeString(date: Date | string | number, locale?: string): string` - Gets a relative time string (e.g., "2 days ago")

### Numbers

- `formatNumber(value: number | string, options?: NumberFormatOptions, locale?: string): string` - Formats a number
- `formatCurrency(value: number | string, currency?: string, options?: NumberFormatOptions, locale?: string): string` - Formats a number as currency
- `formatPercent(value: number | string, options?: NumberFormatOptions, locale?: string): string` - Formats a number as a percentage
- `formatUnit(value: number | string, unit?: string, options?: NumberFormatOptions, locale?: string): string` - Formats a number with a unit
- `parseNumber(value: string, locale?: string): number | null` - Parses a localized number string

### Pluralization

- `pluralize(count: number, forms: PluralForms, locale?: string, options?: PluralOptions): string` - Selects the correct plural form
- `formatPlural(count: number, forms: PluralForms, locale?: string, options?: PluralOptions): string` - Formats a string with a count and plural form
- `formatOrdinal(num: number, locale?: string): string` - Formats a number as an ordinal (1st, 2nd, 3rd, etc.)

### Text Handling

- `getTextDirection(locale?: string): TextDirection` - Gets the text direction for a locale
- `isRTL(locale?: string): boolean` - Checks if a locale is right-to-left
- `truncateText(text: string, maxLength: number, locale?: string, options?: TruncateOptions): string` - Truncates text to a maximum length
- `toTitleCase(text: string, locale?: string): string` - Converts a string to title case
- `capitalize(text: string, locale?: string, options?: CapitalizeOptions): string` - Capitalizes the first letter of a string

## Examples

### Formatting a date range

```typescript
import { formatDateRange } from './date';

const start = '2023-05-15';
const end = '2023-05-17';

// English
console.log(formatDateRange(start, end, 'long', 'en'));
// 'May 15 – 17, 2023'

// Slovenian
console.log(formatDateRange(start, end, 'long', 'sl'));
// '15.–17. maj 2023'
```

### Handling plurals

```typescript
import { formatPlural } from './plural';

const items = 5;

// English
console.log(formatPlural(items, {
  one: '{count} item',
  other: '{count} items'
}, 'en'));
// '5 items'

// Slovenian
console.log(formatPlural(items, {
  one: '{count} kos',
  two: '{count} kosa',
  few: '{count} kosi',
  other: '{count} kosov'
}, 'sl'));
// '5 kosov'
```

## Best Practices

1. **Always pass the locale explicitly** when calling formatting functions to ensure consistent behavior.
2. **Cache formatters** when possible, especially in loops or frequently called functions.
3. **Handle missing translations gracefully** by providing fallback values.
4. **Test with different locales** to ensure proper formatting and layout, especially with RTL languages.
5. **Use the provided utilities** instead of manual string manipulation for dates, numbers, and plurals.
6. **Consider performance** when formatting large numbers of items - batch formatting operations when possible.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
