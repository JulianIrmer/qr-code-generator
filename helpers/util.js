const authenticate = (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
};

export {
    authenticate,
}