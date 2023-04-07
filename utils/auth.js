const withAuth = (req, res, next) => {
    if (!res.session.logged_in) {
        res.redirect('/login');
    } else {
        next();
    }
};


module.exports = withAuth;