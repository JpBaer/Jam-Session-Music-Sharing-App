const router = require('express').Router();
const {Comment} = require('../../models');

router.post('/', async(req, res) => {
    try {
        
       // console.log(req.body)
        const newComment = await Comment.create({
            content: req.body.comment,
            playlist_id: req.body.playlist_id,
            user_id: req.session.user_id,
        })

       
        res.status(200).json(newComment);
    }
    catch (err){
        res.json(err);
 
    }
})

module.exports = router;