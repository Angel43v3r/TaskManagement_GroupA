import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';
import api from '../api/axios';


vi.mock('../api/axios', () => ({
    default: { get: vi.fn() },
}));

describe('AutocompleteSearch', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('returns an empty array when the query is empty', () => {
        const { result } = renderHook(() => AutocompleteSearch('/search', ''))

        expect(result.current).toEqual([]);
        expect(api.get).not.toHaveBeenCalled();
    })
});