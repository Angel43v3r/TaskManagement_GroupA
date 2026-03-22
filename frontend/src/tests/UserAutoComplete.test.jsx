import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import UserAutoComplete from '../components/IssueForm/UserAutoComplete';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';

vi.mock('../components/IssueForm/AutocompleteSearch', () => ({
    default: vi.fn(),
}));

describe('UserAutoComplete', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the reporter input', () => {
        render(
            <UserAutoComplete
                userValue={null}
                onUserValueChange={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    });

    it('calls AutoCompleteSearch with the input value', async () => {
        AutocompleteSearch.mockReturnValue([]);

        const user = userEvent.setup();

        render(
            <UserAutoComplete
                userValue={null}
                onUserValueChange={vi.fn()}
            />
        );

        const input = screen.getByRole('combobox');

        await user.type(input, 'Alice');
        await waitFor(() => {
            expect(AutocompleteSearch).toHaveBeenLastCalledWith(
                '/users/search',
                'Alice'
            );
        });
    });
})