const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
            },
        },
        spotify_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        top_songs: {
        type: DataTypes.STRING,
        allowNull: true
        },
        top_artists: {
            type: DataTypes.STRING,
            allowNull: true
        },
        followers: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        profile_picture_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // this value will only be present if the user has given us permissions and logged in to their spotify 
        // accessToken: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
               updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
               return updatedUserData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;