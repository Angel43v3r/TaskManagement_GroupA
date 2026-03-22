import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DescriptionField from '../components/IssueForm/DescriptionField';


describe('DescriptionField', () => {
    it('renders the description lable', () => {
        render(
            <DescriptionField
                description=""
                onUpdateDescription={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
});