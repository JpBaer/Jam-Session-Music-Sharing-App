const router = require('express').Router();
const {User, Message, Conversation } = require('../models');
const withAuth = require('../utils/auth');
const Op = require('sequelize').Op

//Grab all conversation id's and receiver ids to display
//Grab all conversation for current user
router.get('/', withAuth, async (req, res) => {
  try {
    console.log('conversation route /get')
    console.log(req.session.user_id)
    const conversationData = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1: req.session.user_id },
          { user2: req.session.user_id }
        ]
      }
      ,
     // {model:Tag, through: ProductTag, as: 'taggedProducts'}
      include: [{ model: Message },{model: User, as: 'Creator'},{model: User, as: 'Recipient'}
      ]
    });
    console.log('**********************')
   
    // Check if there is any conversation data returned by the query
    if (!conversationData.length) {
      // Render the conversation page with an empty conversations array
      return res.render('conversations', {
        conversations: [],
        id: req.session.user_id,
        logged_in: req.session.logged_in
      });
    }

    // Simplify conversation data
    const conversations = conversationData.map((conv) =>
      conv.get({ plain: true })
    );

   
    console.log(conversations)
    res.render('conversations', {
      id: req.session.user_id,
      conversations: conversations,
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