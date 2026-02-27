import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  formatDateTime,
  formatDueDate,
  datePickerValueToDueAtUtcIso,
  getRelativeDueTime,
} from '../utils/dateTime';

dayjs.extend(utc);
dayjs.extend(relativeTime);

describe('dateTime utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-20T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateTime', () => {
    it('returns fallback for null/invalid', () => {
      expect(formatDateTime(null)).toBe('-');
      expect(formatDateTime('bad-date')).toBe('-');
    });

    it('formats valid ISO correctly (UTC env)', () => {
      const iso = '2026-02-20T23:59:59.999Z';
      expect(formatDateTime(iso, { format: 'YYYY-MM-DD HH:mm' })).toBe(
        '2026-02-20 23:59'
      );
    });
  });

  describe('formatDueDate', () => {
    it('returns fallback for null', () => {
      expect(formatDueDate(null)).toBe('-');
    });

    it('formats date correctly', () => {
      const iso = '2026-02-20T23:59:59.999Z';
      expect(formatDueDate(iso, { format: 'YYYY-MM-DD' })).toBe('2026-02-20');
    });
  });

  describe('datePickerValueToDueAtUtcIso', () => {
    it('returns null for null input', () => {
      expect(datePickerValueToDueAtUtcIso(null)).toBeNull();
    });
    it('converts picked date to end-of-day UTC', () => {
      const picked = dayjs('2026-02-20');
      const iso = datePickerValueToDueAtUtcIso(picked);
      expect(iso).toBe('2026-02-20T23:59:59.999Z');
    });
  });

  describe('getRelativeDueTime', () => {
    it('returns empty string for null/invalid', () => {
      expect(getRelativeDueTime(null)).toBe('');
      expect(getRelativeDueTime('bad')).toBe('');
    });

    it('returns correct future relative time', () => {
      const now = '2026-02-18T00:00:00.000Z';
      const iso = '2026-02-20T23:59:59.999Z';
      expect(getRelativeDueTime(iso, { now })).toBe('in 3 days');
    });

    it('returns correct past relative time', () => {
      const now = '2026-02-20T00:00:00.000Z';
      const iso = '2026-02-18T12:00:00.000Z';
      expect(getRelativeDueTime(iso, { now })).toBe('2 days ago');
    });
  });
});
