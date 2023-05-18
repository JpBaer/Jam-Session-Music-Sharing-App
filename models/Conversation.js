const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Conversation extends Model {}

Conversation.init({
 //Do i need to add an id here or will it make it itself 
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    dateUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    },
    user1: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    },
    user2: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    }
},
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'conversation',
    })

 module.exports = Conversation   