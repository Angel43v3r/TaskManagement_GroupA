import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Issue', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Comment;
