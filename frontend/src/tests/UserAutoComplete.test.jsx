import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import UserAutoComplete from '../components/IssueForm/UserAutoComplete';

describe('UserAutoComplete', () => {
    
    vi.mock('../components/IssueForm/AutocompleteSearch', () => ({
        default: vi.fn(),
    }));

    it('renders the reporter input', () => {
        render(
            <UserAutoComplete
                userValue={null}
                onUserValueChange={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    });
})