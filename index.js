require('dotenv').config();
const url = require('url');
const path = require('path');
const Discord = require('discord.js');
const express = require('express');
const app = express();
const moment = require('moment'); require('moment-duration-format');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const { Strategy } = require('passport-discord');

const helmet = require('helmet');
const md = require('marked');
const PORT = process.env.PORT || 4200;

const Authentication = require('./functions/Authentication');
const Render = require('./functions/Render.js')

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4200/callback',
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
}));

app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.locals.domain = process.env.DOMAIN;
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    Render(req, res, 'index.ejs');
});

app.get('/403', (req, res) => {
    Render(req, res, '403.ejs');
});

app.get('/404', (req, res) => {
    Render(req, res, '404.ejs');
});

app.get('/500', (req, res) => {
    Render(req, res, '500.ejs');
});

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/500' }), (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', Authentication, (req, res) => {
    const guilds = req.user.guilds.filter((g) => {
        const permissions = new Discord.Permissions(g.permissions);
        return permissions.has('MANAGE_GUILD');
    });
    Render(req, res, 'dashboard.ejs', { guilds });
});

app.get('/login', (req, res, next) => {
    next();
}, passport.authenticate('discord'));

app.get('/logout', function (req, res) {
    req.session.destroy(() => {
        req.logout();
        res.redirect('/');
    });
});

app.use((req, res, next) => {
    res.redirect('/404');
})

app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});