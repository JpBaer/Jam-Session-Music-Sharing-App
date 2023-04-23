const router = require('express').Router();
const {User, Message, Conversation } = require('../models');


router.get('/:id', async (req, res) => {
    try{

    }
    catch(err) {
        res.status(500).json(err)
      }
})


module.exports = router;