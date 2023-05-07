const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Message extends Model { }

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
        },
        receiver_id: {
            type: DataTypes.INTEGER,
        },
        conversation_id: {
            type: DataTypes.INTEGER
        },
        //Add time so when you pull conversation it will sort by time, can be in UNIS
        dateAdded: {
            type: DataTypes.DATE,
            defaultValue: Date.now()
        }

    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'message',
    }
)

module.exports = Message;