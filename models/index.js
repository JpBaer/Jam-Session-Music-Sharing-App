const User = require('./User');
const Playlist = require('./Playlist');
const Comment = require('./Comment');
const Message = require('./Message')
const Conversation = require('./Conversation')

User.hasMany(Playlist, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Playlist.belongsTo(User, {
    foreignKey: 'user_id'
});

Playlist.hasMany(Comment,{
    foreignKey: 'playlist_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Playlist,{
    foreignKey: 'playlist_id'
});

User.hasMany(Comment,{
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User,{
    foreignKey: 'user_id'
})

//Messages Associations

User.hasMany(Message, {
    as:"SentMessage",
    foreignKey:'sender_id'
})

User.hasMany(Message,{
    as:"ReceivedMessage",
    foreignKey: 'receiver_id'
})

Message.belongsTo(User, {
    as:"Sender",
    foreignKey: "sender_id",
    allowNull: false
});

Message.belongsTo(User,{
    as:"Receiver",
    foreignKey: "receiver_id",
    allowNull: false
});

Message.belongsTo(Conversation, {allowNull: false}, {
    foreignKey: 'conversation_id',
});

Conversation.hasMany(Message,{
    foreignKey: "conversation_id"
});

//Conversation Associations

User.hasMany(Conversation, {
    foreignKey: 'user1'
});

User.hasMany(Conversation, {
    foreignKey: 'user2'
});

Conversation.belongsTo(User, {as: 'Creator', foreignKey: 'user1', allowNull: false});

Conversation.belongsTo(User, {as: 'Recipient', foreignKey: 'user2', allowNull: false});

module.exports = { User, Playlist, Comment, Message, Conversation };