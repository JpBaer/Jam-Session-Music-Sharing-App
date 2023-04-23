const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const messageRoutes = require('./messageRoutes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
