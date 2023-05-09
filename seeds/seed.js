const sequelize = require('../config/connection');
const { User, Playlist, Message, Conversation } = require('../models');

const userData = require('./userData.json');
const playlistData = require('./playlistData.json');
const messageData = require('./messageData.json');
const conversationData = require('./conversationData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true});

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const playlist of playlistData){
        await Playlist.create({
            ...playlist,
            user_id: users[Math.floor(Math.random()* users.length)].id,
        })
    };

    const conversations = await Conversation.bulkCreate(conversationData,{
        returning: true,
    });

    const messages = await Message.bulkCreate(messageData,
        {
        returning: true,
    })

    


    process.exit(0);
};


seedDatabase();