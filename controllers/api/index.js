const router = require('express').Router();
const userRoutes = require('./userRoutes');
//need to const another model when done setting up

router.use('/users', userRoutes);
// router.use('/ourmodel', modelroutes);







module.exports = router;