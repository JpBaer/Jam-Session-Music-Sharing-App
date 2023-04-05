const router = require('express').Router();

const apisRoutes = require('./apis');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/apis', apisRoutes);

module.exports = router;