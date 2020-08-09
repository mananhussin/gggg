const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const EventEmitter = require('events').EventEmitter;
const Logger = require('../utils/Logger');

const Database = require('../api/Database');
const BaseRoute = require('./Route');
const BaseEvent = require('./WebEvent');
const WebSocketEvent = require('./WebSocketEvent');

const TagManager = require('../managers/TagManager');
const UserManager = require('../managers/UserManager');
const GuildManager = require('../managers/GuildManager');
const MemberManager = require('../managers/MemberManager');

class App extends EventEmitter {
    constructor() {
        super();
        this.logger = Logger;
        this.ws = new Database();
        this.app = express();
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }));
        this.app.use('/public', express.static(path.join(__dirname, '..', 'public')));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.db = {
            tags: new TagManager(this),
            users: new UserManager(this),
            guilds: new GuildManager(this),
            members: new MemberManager(this),
        }
    }
    /**
     * 
     * @param {string} template
     * @param {express.request} req 
     * @param {express.response} res 
     * @param {{}} options
     */
    renderTemplate(template, req, res, options = {}) {
        const base = {
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
        };
        res.render(template, Object.assign(base, options));
    }
    async register() {
        await this.registerRoutes();
        await this.registerWebEvents();
        await this.registerWebSocketEvents();
    }
    /**
     * @private
     */
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
                this.renderTemplate('index.ejs', req, res);
            });
        } catch (e) {
            this.logger.error(e);
        }
        return this;
    }
    /**
     * @private
     */
    async registerWebSocketEvents() {
        try {
            const filePath = path.join(__dirname, '..', 'events','websocket');
            const files = await fs.readdir(filePath);
            for (const file of files) {
                if (!file.endsWith('.js')) continue;
                const Event = require(path.join(filePath, file));
                if (Event.prototype instanceof WebSocketEvent) {
                    const instance = new Event(this);
                    this.ws.on(instance.eventName, (...args) => instance.emit(...args));
                    delete require.cache[require.resolve(path.join(filePath, file))];
                }
            }
        } catch (e) {
            this.logger.error(e);
        }
        return this;
    }
    /**
     * @private
     */
    async registerWebEvents() {
        try {
            const filePath = path.join(__dirname, '..', 'events','web');
            const files = await fs.readdir(filePath);
            for (const file of files) {
                if (!file.endsWith('.js')) continue;
                const Event = require(path.join(filePath, file));
                if (Event.prototype instanceof BaseEvent) {
                    const instance = new Event(this);
                    this.on(instance.eventName, (...args) => instance.emit(...args));
                    delete require.cache[require.resolve(path.join(filePath, file))];
                }
            }
        } catch (e) {
            this.logger.error(e);
        }
        return this;
    }
    /**
     * 
     * @param {function()} fn 
     */
    listen(fn) {
        this.ws.connect();
        this.app.listen(80, () => {
            this.emit('ready');
            fn();
        });
    }
}

module.exports = App;