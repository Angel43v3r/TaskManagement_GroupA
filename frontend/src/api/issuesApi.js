import api from './axios';

/**
 * API service for managing Issue resources.
 * * Provides methods to interact with the issue-related endpoints within the
 * hierarchy of projects and boards.
 */
export const issuesApi = {
  /**
   * Retrieves all issues associated with a specific board within a project.
   * * @param {string|number} projectId - The unique identifier of the parent project.
   * @param {string|number} boardId - The unique identifier of the board.
   * @returns {Promise<Object>} A promise resolving to an array of issue objects.
   * @example
   * const issues = await issuesApi.getAll(1, 5);
   */
  getAll: (projectId, boardId) =>
    api.get(`/projects/${projectId}/boards/${boardId}/issues`),

  /**
   * Updates specific fields of an existing issue (Partial Update).
   * * Uses the PATCH method to modify only the fields provided in the `changes` object,
   * preserving other issue properties.
   * * @param {string|number} projectId - The unique identifier of the parent project.
   * @param {string|number} boardId - The unique identifier of the board.
   * @param {string|number} issueId - The unique identifier of the issue to be updated.
   * @param {Object} changes - The properties to update (e.g., { title: 'New Name', status: 'Done' }).
   * @returns {Promise<Object>} A promise resolving to the updated issue object.
   * @example
   * await issuesApi.update(1, 5, 101, { status: 'In Progress' });
   */
  update: (projectId, boardId, issueId, changes) =>
    api.patch(
      `/projects/${projectId}/boards/${boardId}/issues/${issueId}`,
      changes
    ),
};
