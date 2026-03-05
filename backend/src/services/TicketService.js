import { Issue } from '../models/models.js';

export const getById = async (id) => {
  return await Issue.findByPk(id, {
    include: ['assignees'],
  });
};
