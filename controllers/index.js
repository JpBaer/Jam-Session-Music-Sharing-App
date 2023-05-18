const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const conversationRoutes = require('./conversationRoutes')
//const searchRoutes = require('./searchRoutes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/conversations', conversationRoutes);
//router.use('/search',searchRoutes);
module.exports = router;
