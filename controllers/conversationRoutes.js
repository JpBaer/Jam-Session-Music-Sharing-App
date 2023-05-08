const router = require('express').Router();
const {User, Message, Conversation } = require('../models');
const withAuth = require('../utils/auth');


//Grab all conversation id's and receiver ids to display
//Grab all conversation for current user
router.get('/', withAuth, async (req, res) => {
  try {
    console.log('hello')
    const conversationData = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1: req.session.user_id },
          { user2: req.session.user_id }
        ]
      },
      include: [{ model: Message }]
    });
    console.log('**********************')
    console.log(conversationData)
    // Check if there is any conversation data returned by the query
    if (!conversationData) {
      // Render the conversation page with an empty conversations array
      return res.render('conversations', {
        conversations: [],
        logged_in: req.session.logged_in
      });
    }

    // Simplify conversation data
    const conversations = conversationData.map((conv) =>
      conv.get({ plain: true })
    );
    res.render('conversations', {
      conversations,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create another get route for /:user_id/:id where :id is the conversation id
router.get('/:id',withAuth, async (req, res)=> {
  try{
    const messageData = await Conversation.findByPk({include: [{model: Message}]});
    const messages = messageData.map((m)=> m.get({plain: true}));

    res.render('messages', {
      messages,
      logged_in: req.session.logged_in
    })

  } catch(err) {
    res.status(500).json(err)
  }

})


module.exports = router;