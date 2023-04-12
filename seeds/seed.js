const sequelize = require('../config/connection');
const { User, Playlist } = require('../models');

const userData = require('./userData.json');
const PlaylistData = require('./playlistData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true});

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const playlist = await Playlist.bulkCreate(PlaylistData, {
        individualHooks: true,
        returning: true,
    });


    process.exit(0);
};


seedDatabase();