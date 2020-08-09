const Route = require('../classes/Route');

const passport = require('passport');
const { Strategy } = require('passport-discord');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URI,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
}));

class OAuth extends Route {
    constructor(app) {
        super(app, '/oauth');
    }
    createRoute() {
        this.app.app.use(passport.initialize());
        this.app.app.use(passport.session());
        this.route.get('/login', (req, res, next) => {
            next();
        }, passport.authenticate('discord', { failureRedirect: '/500' }));
        this.route.get('/logout', (req, res) => {
            this.app.logger.info(`(${req.user.username}#${req.user.discriminator}/${req.user.id}) has been logout!`, 'Client');
            req.session.destroy(() => {
                req.logout();
                res.redirect('/');
            });
        });
        this.route.get('/callback', passport.authenticate('discord', { failureRedirect: '/500' }), (req, res) => {
            this.app.logger.info(`(${req.user.username}#${req.user.discriminator}/${req.user.id}) has been authenticated!`, 'Client');
            res.redirect('/dashboard');
        });
        return this.route;
    }
}

module.exports = OAuth;