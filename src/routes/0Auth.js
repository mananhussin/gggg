const Route = require('../classes/Route');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const User = require('../classes/DiscordUser');

class OAuth extends Route {
    constructor(app) {
        super(app, '/oauth');
    }
    createRoute() {
        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser(async (userp, done) => {
            const user = await this.app.localdb.User.findOne({ where: { id: userp.id } });
            if (user) {
                return user ? done(null,
                    new User(Object.assign(
                        user.toJSON(), {
                        accessToken: this.app.aes.decrypt(user.accessToken),
                        refreshToken: this.app.aes.decrypt(user.refreshToken)
                    }))
                ) : done(null, null);
            }
        });
        passport.use(new Strategy({
            clientID: this.app.mode !== 'DEV' ? process.env.CLIENT_ID : process.env.DEV_CLIENT_ID,
            clientSecret: this.app.mode !== 'DEV' ? process.env.CLIENT_SECRET : process.env.DEV_CLIENT_SECRET,
            callbackURL: this.app.mode !== 'DEV' ? process.env.CLIENT_REDIRECT : process.env.DEV_CLIENT_REDIRECT,
            scope: ['identify', 'guilds'],
        }, async (accessToken, refreshToken, profile, done) => {
            const user = new User(Object.assign(profile, { accessToken, refreshToken }));
            try {
                let findUser = await this.app.localdb.User.findOne({ where: { id: user.id } }).catch((e) => { throw e; });
                if (findUser) await this.app.localdb.User.update(
                    Object.assign(user.toJSON(), {
                        accessToken: this.app.aes.encrypt(user.accessToken),
                        refreshToken: this.app.aes.encrypt(user.refreshToken)
                    }), { where: { id: user.id } }).catch((e) => { throw e; });
                else await this.app.localdb.User.create(Object.assign(user.toJSON(), {
                    accessToken: this.app.aes.encrypt(user.accessToken),
                    refreshToken: this.app.aes.encrypt(user.refreshToken)
                })).catch((e) => { throw e; });
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
        this.app.app.use(passport.initialize());
        this.app.app.use(passport.session());
        this.route.get('/login', (req, res, next) => {
            if (req.isAuthenticated()) return res.redirect('/');
            next();
        }, passport.authenticate('discord'));
        this.route.get('/logout', (req, res) => {
            if (!req.isAuthenticated()) return res.redirect('/');
            this.app.logger.info(`(${req.user.tag}/${req.user.id}) has been logout!`, 'Client');
            req.session.destroy(() => {
                req.logout();
                res.redirect('/');
            });
        });
        this.route.get('/redirect', passport.authenticate('discord', { failureRedirect: '/oauth/login' }), (req, res) => {
            this.app.logger.info(`(${req.user.tag}/${req.user.id}) has been authenticated!`, 'Client');
            res.redirect('/dashboard');
        });
        return this.route;
    }
}

module.exports = OAuth;