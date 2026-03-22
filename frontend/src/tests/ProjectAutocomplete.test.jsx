import ProjectAutocomplete from "../components/IssueForm/ProjectAutocomplete";
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';

vi.mock('../components/IssueForm/AutocompleteSearch', () => ({
  default: vi.fn(),
}));

describe('ProjectAutocomplete', () => {
  afterEach(() => {
    cleanup();
  });

    it('renders the options input', () => {
        render(<ProjectAutocomplete
            value={null}
            onChange={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/project/i)).toBeInTheDocument();
    });

  it('calls AutoCompleteSearch with the input value', async () => {
    AutocompleteSearch.mockReturnValue([]);

    const project = userEvent.setup();

    render(<ProjectAutocomplete value={null} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');

    await project.type(input, 'app');
    await waitFor(() => {
      expect(AutocompleteSearch).toHaveBeenLastCalledWith(
        '/api/projects',
        'app'
      );
    });
  });
});