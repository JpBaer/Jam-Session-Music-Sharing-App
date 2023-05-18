const router = require('express').Router();
const {Conversation, Message, User} = require('../../models');

//How can we consolidate this so that when a first message is sent it automatically creates a conversation
//We should be able to just have a single message button
//If there are no messages between those two users already it will create a new conversation
//otherwise it will add to the existing conversation
//We dont want users to be able to have multiple conversation threads with the same users
//How do we want users to be able to start conversations?
        //We could render a button on other users profiles that let you message
        //Or we could add a search feature on the conversations page
        //Or in the main search bar we could add a message button next to every user that shows up in the drop down
        



//Create a post route for conversations
//Create a post route for new messages within that conversation
router.post('/', async(req, res) => {
    try {
        console.log('New conversation added to database')
        console.log(req.body)
        const conversationData = await Conversation.create({
            //sender will be the logged in user
            user1: req.session.user_id,
            //user2 will be the recipient
            //Will this come from a request body or should it be passed as a parameter in the url?
            user2: req.body.user_id
        });
        res.status(200).json(conversationData);
    } catch(err)
{
    res.json(err)
}
})

//messages route will take conversation id as a url param

router.post('/:conversation_id', async(req, res) => {
    try {
        //Should user data be passed in the body or should the conversation
        //id be used to find that conversation and pull the user data?
        console.log('New message added to conversation')
        console.log(req.body);
        const messageData = await Message.create({
            message: req.body.message,
            sender_id: req.session.message,
            receiver_id: req.body.id,
            conversation_id: req.params.conversation_id
        })
        res.status(200).json(messageData)
    } catch(err){
        res.json(err)
    }
})





module.exports = router;