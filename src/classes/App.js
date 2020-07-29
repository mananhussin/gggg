const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const EventEmitter = require('events').EventEmitter;
const Logger = require('../utils/Logger');
const Wait = require('../utils/Wait');

const BaseRoute = require('./Route');
const BaseEvent = require('./Event');

class App extends EventEmitter {
    /**
     * 
     * @param {Object} options 
     * @param {string} options.session_secret
     * @param {string} options.domain
     * @param {{}} [options.https?]
     */
    constructor(options) {
        super();
        if (typeof options !== 'object') throw options;
        const { session_secret, domain, https } = options;
        this.https = https;
        this.logger = Logger;
        this.wait = Wait;
        this.app = express();
        this.app.locals.domain = domain;
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: session_secret,
            resave: false,
            saveUninitialized: false,
        }));
        this.app.use('/public', express.static(path.join(__dirname, '..', 'public')));
    }
    /**
     * 
     * @param {string} template
     * @param {express.request} req 
     * @param {express.response} res 
     * @param {{}} options
     */
    renderTemplate(template, req, res, options) {
        const base = {
            path: req.path,
            user: req.isAuthenticated() ? req.user : null, 
        };
        res.render(template, Object.assign(base, options));
    }
    async registerRoutes() {
        try {
            const filePath = path.join(__dirname, '..', 'routes');
            const files = await fs.readdir(filePath);
            for await (const file of files) {
                if (!file.endsWith('.js')) continue;
                const Route = require(path.join(filePath, file));
                if (Route.prototype instanceof BaseRoute) {
                    const instance = new Route(this);
                    this.app.use(instance.path, instance.createRoute());
                    this.logger.info(`${instance.path}`);
                }
            }
            this.app.get('/', (req, res) => {
                this.renderTemplate('index.ejs', req, res, {});
            });
        } catch (e) {
            this.logger.error(e, 'Server');
        }
        return this;
    }
    async registerEvents() {
        try {
            const filePath = path.join(__dirname, '..', 'routes');
            const files = await fs.readdir(filePath);
            for (const file of files) {
                if (!file.endsWith('.js')) continue;
                const Event = require(path.join(filePath, file));
                if (Event.prototype instanceof BaseEvent) {
                    const instance = new Event(this);
                    this.on(instance.eventName, (...args) => instance.emit(...args));
                    this.logger.info(`Event ${instance.eventName}`);
                    delete require.cache[require.resolve(path.join(filePath, file))];
                }
            }
        } catch (e) {
            this.logger.error(e, 'Server');
        }
        return this;
    }
    /**
     * @returns {App}
     * @param {Number} port 
     * @param {function(port<number>)} fn 
     */
    listen(port, fn) {
        if (typeof port !== "number") throw new TypeError(`Parameter 'port' should be a number, instead gotten a type of '${typeof port}'`);
        if (this.https) {
            try {
                this.logger.info(`Using https...`)
                https.createServer(this.https, this.app).listen(port);
            } catch (e) {
                this.logger.error(e, 'Server');
            }
        } else {
            this.app.listen(port);
        }
        fn(port);
        this.emit('ready', port);
        return this;
    }
}

module.exports = App;