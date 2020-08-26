const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const EventEmitter = require('events').EventEmitter;

const Bot = require('../api/Bot');
const Database = require('../api/Database');
const BaseRoute = require('./Route');
const BaseEvent = require('./WebEvent');
const WebSocketEvent = require('./WebSocketEvent');
const Terminal = require('../terminal');

const UserManager = require('../managers/UserManager');
const GuildManager = require('../managers/GuildManager');

const AES = require('../utils/AES');
const Logger = require('../utils/Logger');
const LocalDB = require('../database/');

class App extends EventEmitter {
    constructor() {
        super();
        this.logger = Logger;
        this.bot = new Bot();
        this.ws = new Database();
        this.app = express();
        this.mode = process.env.MODE;
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: this.mode !== 'DEV' ? process.env.CLIENT_SECRET : process.env.DEV_CLIENT_SECRET,
            resave: false,
            saveUninitialized: false,
        }));
        this.app.use('/public', express.static(path.join(__dirname, '..', 'public')));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.db = {
            users: new UserManager(this),
            guilds: new GuildManager(this),
        }
        this.aes = new AES(process.env.AES_KEY);
        this.localdb = new LocalDB(this);
        this.terminal = new Terminal(this);
    }
    /**
     * 
     * @param {express.Request} req 
     * @param {express.response} res 
     * @param {function()} next 
     */
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/oauth/login');
    }
    /**
     * 
     * @param {string} template
     * @param {express.request} req 
     * @param {express.response} res 
     * @param {{}} options
     * @param {number} [status=200]
     */
    renderTemplate(template, req, res, options = {}, status = 200) {
        return res.status(status).render(template, Object.assign({
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
        }, options));
    }
    async register() {
        await this.registerRoutes();
        await this.registerWebEvents();
        await this.registerWebSocketEvents();
        this.terminal.initiate();
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
                    delete require.cache[require.resolve(path.join(filePath, file))];
                }
            }
            this.app.get('/', (req, res) => {
                this.renderTemplate('index.ejs', req, res);
            });
            this.app.use((req, res) => {
                this.renderTemplate('404.ejs', req, res, {}, 404);
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
            const filePath = path.join(__dirname, '..', 'events', 'websocket');
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
            const filePath = path.join(__dirname, '..', 'events', 'web');
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
    async listen(fn) {
        this.ws.connect();
        if (this.mode === 'DEV') {
            const cert = await fs.readFile('localhost.cert');
            const key = await fs.readFile('localhost.key');
            require('https').createServer({
                cert: cert,
                key: key,
            }, this.app).listen(443, () => {
                this.emit('ready');
                fn();
            });
        } else {
            this.app.listen(443, () => {
                this.emit('ready');
                fn();
            });
        }
    }
}

module.exports = App;