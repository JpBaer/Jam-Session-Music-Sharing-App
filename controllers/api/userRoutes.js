const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
 try {
    console.log('user info being sent to database')
    console.log(req.body)
    const userData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    console.log('userData added to DB');
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.randomSongs = false;
      req.session.randomArtists = false;
    

      res.status(200).json(userData);
    });
 } catch (err) {
    res.json(err);
 }
});

router.post('/login', async (req, res) => {
 try {
    const userData = await User.findOne({ where: { email: req.body.email} });

        if(!userData) {
            res
                .status(400)
                .json({ message: 'Email or password is incorrect, please try again'});
            return;
        }
    
        const validPW = await userData.checkPassword(req.body.password);

        if (!validPW) {
            res
                .status(400)
                .json({ message: 'Email or password is incorrect, please try again'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            req.session.randomSongs = false;
            req.session.randomArtists = false;

            res.json({ user: userData, message: 'Successfully logged in! Enjoy' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });

    } else {
        res.status(404).end();
    }
});

module.exports = router;