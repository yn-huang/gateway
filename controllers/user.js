const User = require('../models/user');

module.exports.showSignup = (req, res) => {
    res.render('users/signup');
}

module.exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;
        const user = new User({ email, username, firstName, lastName });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Successfully registered, please login!')
        res.redirect('/user/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/signup')
    }
}

module.exports.showLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/');
}