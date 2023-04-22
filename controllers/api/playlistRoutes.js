const router = require('express').Router();
const { Playlist, Comment, User } = require('../../models');

router.put('/like', async(req, res) => {
    try {
      
        const playlistData = await Playlist.findByPk(req.body.playlist_id);
        
        playlist = playlistData.get({ plain: true });
    
        likeValue = playlistData.likes;
        likeValue++;
        playlistLikes = {"likes": likeValue}
        console.log(playlistLikes)
        const updatedPlaylistData = await Playlist.update(playlistLikes,{
            where: {
                playlist_id: req.body.playlist_id
            }
        })
        console.log('Playlist updated')
        if (!updatedPlaylistData) {
            res.status(404).json({message: 'No Playlist with that id found.'})
            return;
          }
        
          res.status(200).json(updatedPlaylistData)
        
    } catch (err){
        res.json(err);
    }
})

router.get('/:playlist_id/comments', async(req, res) => {
    try {
        console.log('API Reached')
        const playlist_id = req.params.playlist_id;
        console.log(playlist_id)
        const commentData = await Comment.findAll({where: {
            playlist_id: playlist_id
        }, include: [{model:User}]
        })

        console.log(commentData)
        const comments = commentData.map((comments) => comments.get({ plain: true }));
        console.log('**************************')
        console.log(comments)
        res.json(comments)
    }
    catch(err){
        res.json(err);
    }
})
module.exports = router;