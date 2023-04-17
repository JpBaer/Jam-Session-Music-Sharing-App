const router = require('express').Router();
const userRoutes = require('./userRoutes');
const playlistRoutes = require('./playlistRoutes')
const commentRoutes = require('./commentRoutes')
//need to const another model when done setting up

router.use('/user', userRoutes);
router.use('/playlist', playlistRoutes)
router.use('/comment',commentRoutes)
// router.use('/ourmodel', modelroutes);







module.exports = router;