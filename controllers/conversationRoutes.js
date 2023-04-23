const router = require('express').Router();
const {User, Message, Conversation } = require('../models');



//Grab all conversation id's and receiver ids to display
router.get('/', async (req, res) => {
    try{
      //Op.or in this line is an or statement saying if either of the conditions apply include it
      const conversationData = await Conversation.findAll({where: {[Op.or]:[{user1: req.session.user_id},{user2: req.session.user_id}]}})
      //simplify conversation data
      const conversations = conversationData.map((conv) => conv.get({ plain: true }));
      res.render('conversations', {
        conversations,
        logged_in: req.session.logged_in
      })

    }
    catch(err) {
        res.status(500).json(err)
      }
})

//Create another get route for /:user_id/:id where :id is the conversation id
router.get('/:id', async (req, res)=> {
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