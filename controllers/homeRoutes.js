const router = require('express').Router();
const { Playlist, User } = require('../models');
const withAuth = require('../utils/auth');
//need to create utils folder that contains auth.js and link it here
// projectData will need to be replaced with our model later on
//might need to create helpers and link it here
router.get('/', async (req, res) => {
    try {
      //const playlistData = await Playlist.findAll({
       // include: [
         // {
          //  model: User,
          //  attributes: ['name'],
         // },
        //],
//});
  
     // const playlists = playlistData.map((playlist) => playlist.get({ plain: true }));
  
      res.render('homepage', { 
      //  playlists, 
       // logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/playlist/:id', async (req, res) => {
    try {
      const playlistData = await Playlist.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
  
      const playlist = playlistData.get({ plain: true });
  
      res.render('playlist', {
        ...playlist,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //profile.js  file will be in public folder when done setting up
  // router.get('/profile', withAuth, async (req, res) => {
  //   try {
  //     const userData = await User.findByPk(req.session.user_id, {
  //       attributes: { exclude: ['password'] },
  //       include: [{ model: Playlist }],
  //     });
  
  //     const user = userData.get({ plain: true });
  
  //     res.render('profile', {
  //       ...user,
  //       logged_in: true
  //     });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  
  router.get('/login', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;