const Route = require('../classes/Route');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const User = require('../classes/DiscordUser');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

class OAuth extends Route {
    constructor(app) {
        super(app, '/oauth');
    }
    createRoute() {
        passport.use(new Strategy({
            clientID: this.app.mode !== 'DEV' ? process.env.CLIENT_ID : process.env.DEV_CLIENT_ID,
            clientSecret: this.app.mode !== 'DEV' ? process.env.CLIENT_SECRET : process.env.DEV_CLIENT_SECRET,
            callbackURL: this.app.mode !== 'DEV' ? process.env.CLIENT_REDIRECT : process.env.DEV_CLIENT_REDIRECT,
            scope: ['identify', 'guilds']
        }, (accessToken, refreshToken, profile, done) => {
            const user = new User(Object.assign(profile, { accessToken, refreshToken }));
            this.app.users.set(user.id, user);
            return done(null, user);
        }));
        this.app.app.use(passport.initialize());
        this.app.app.use(passport.session());
        this.route.get('/login', (req, res, next) => {
            next();
        }, passport.authenticate('discord', { failureRedirect: '/?q=500' }));
        this.route.get('/logout', (req, res) => {
            this.app.logger.info(`(${req.user.tag}/${req.user.id}) has been logout!`, 'Client');
            this.app.users.delete(req.user.id);
            req.session.destroy(() => {
                req.logout();
                res.redirect('/');
            });
        });
        this.route.get('/redirect', passport.authenticate('discord', { failureRedirect: '/?q=500' }), (req, res) => {
            this.app.logger.info(`(${req.user.tag}/${req.user.id}) has been authenticated!`, 'Client');
            res.redirect('/');
        });
        return this.route;
    }
}

module.exports = OAuth;