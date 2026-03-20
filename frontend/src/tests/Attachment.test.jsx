// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Attachment from '../components/Attachment';
import { attachmentsApi } from '../api/attachmentsApi';

vi.mock('react-router', () => ({
  useParams: () => ({}),
}));

vi.mock('../api/attachmentsApi', () => ({
  attachmentsApi: {
    listByProject: vi.fn(),
    uploadToProject: vi.fn(),
    downloadById: vi.fn(),
    deleteById: vi.fn(),
  },
}));

describe('Attachment', () => {
  const projectId = 'project-123';
  const uploadedAttachment = {
    id: 'attachment-1',
    projectId,
    filename: 'notes.txt',
    size: 11,
    createdAtUTC: '2026-03-20T20:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('retrieves attachments for the existing project', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);

    render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    expect(screen.getAllByText('notes.txt').length).toBeGreaterThan(0);
  });

  it('uploads a selected file to the existing project', async () => {
    attachmentsApi.listByProject
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.uploadToProject.mockResolvedValue([uploadedAttachment]);

    const { container } = render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    const fileInput = container.querySelector('input[type="file"]');
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('notes.txt (11 B)')).toBeDefined();
    expect(uploadButton.hasAttribute('disabled')).toBe(false);

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(attachmentsApi.uploadToProject).toHaveBeenCalledWith(
        projectId,
        expect.arrayContaining([expect.objectContaining({ name: 'notes.txt' })])
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('notes.txt').length).toBeGreaterThan(0);
    });
  });

  it('deletes an attachment from the existing project', async () => {
    attachmentsApi.listByProject.mockResolvedValueOnce([uploadedAttachment]);
    attachmentsApi.deleteById.mockResolvedValue();

    render(<Attachment projectId={projectId} />);

    await waitFor(() => {
      expect(attachmentsApi.listByProject).toHaveBeenCalledWith(projectId);
    });

    const deleteButton = screen.getByRole('button', { name: 'delete notes.txt' });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(attachmentsApi.deleteById).toHaveBeenCalledWith('attachment-1');
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'delete notes.txt' })).toBeNull();
    });
  });
});
