const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const conversationRoutes = require('./conversationRoutes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router;
