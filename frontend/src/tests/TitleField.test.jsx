import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import TitleField from '../components/IssueForm/TitleField';

describe('TitleField', () => {
    it('renders the title label', () => {
        render(
            <TitleField
                title=''
                onUPdateTitle={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    });

    it('displays the provided title value', () => {
        const mockUpdate = vi.fn();
        render(
            <TitleField
                title='task'
                onUPdateTitle={mockUpdate}
            />
        );

        expect(screen.getByDisplayValue('task')).toBeInTheDocument();
    })
});