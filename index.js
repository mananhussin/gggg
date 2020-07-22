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
const Strategy = require('passport-discord').Strategy;
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
    callbackURL: process.env.CALLBACK_URI,
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

app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
})