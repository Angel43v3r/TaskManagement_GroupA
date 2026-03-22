import ProjectAutocomplete from "../components/IssueForm/ProjectAutocomplete";
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';

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
});