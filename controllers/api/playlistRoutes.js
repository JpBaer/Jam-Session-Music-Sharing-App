const router = require('express').Router();
const { Playlist } = require('../../models');

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
module.exports = router;