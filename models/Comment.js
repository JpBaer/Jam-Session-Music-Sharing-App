const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Comment extends Model {};

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    },
    playlist_id: {
        type: DataTypes.STRING,
        references: {
            model: "playlist",
            key: "playlist_id"
        }
    }

},
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment',
    })

    
    module.exports = Comment;