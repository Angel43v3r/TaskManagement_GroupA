// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../context/ProjectContext', () => ({
  useProject: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

import ProjectsPage from '../pages/Projects';
import { useProject } from '../context/ProjectContext';

const fakeProjects = [
  {
    id: 'proj-1',
    name: 'Alpha Project',
    key: 'ALPHA',
    category: 'New Development',
    status: 'active',
    owner: { firstName: 'John', lastName: 'Doe' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Beta Project',
    key: 'BETA',
    category: 'Maintenance',
    status: 'completed',
    owner: { firstName: 'Jane', lastName: 'Smith' },
    created_at: '2024-02-01T00:00:00Z',
  },
];

describe('ProjectsPage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows loading spinner when loading', () => {
    useProject.mockReturnValue({ projects: [], loading: true, error: null });
    render(<ProjectsPage />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  it('shows empty state message when no projects exist', () => {
    useProject.mockReturnValue({ projects: [], loading: false, error: null });
    render(<ProjectsPage />);
    expect(
      screen.getByText('No projects yet. Create your first one!')
    ).toBeDefined();
  });

  it('shows error alert when context returns an error', () => {
    useProject.mockReturnValue({
      projects: [],
      loading: false,
      error: 'Failed to load projects',
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Failed to load projects')).toBeDefined();
  });

  it('renders project names in the table', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.getByText('Beta Project')).toBeDefined();
  });

  it('renders project keys as chips', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('ALPHA')).toBeDefined();
    expect(screen.getByText('BETA')).toBeDefined();
  });

  it('renders status chips for each project', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Active')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
  });

  it('filters projects by search query (name match)', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.queryByText('Beta Project')).toBeNull();
  });

  it('shows no match message when search has no results', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'zzznomatch' } });

    expect(screen.getByText('No projects match your search.')).toBeDefined();
  });

  it('search is case-insensitive', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'alpha' } });

    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.queryByText('Beta Project')).toBeNull();
  });

  it('navigates to project detail when a row is clicked', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    fireEvent.click(screen.getByText('Alpha Project'));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1');
  });

  it('navigates to create page when Create Project button is clicked', () => {
    useProject.mockReturnValue({ projects: [], loading: false, error: null });
    render(<ProjectsPage />);

    fireEvent.click(screen.getByText('Create Project'));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/create');
  });
});
