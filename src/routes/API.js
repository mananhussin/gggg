const Route = require('../classes/Route');

class API extends Route {
    constructor(app) {
        super(app, '/api/');
        this.parse = {
            topgg: function (body) {
                return {
                    id: body.user,
                    site: 'Top.gg'
                }
            },
        }
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            res.sendStatus(200);
        });
        this.route.use(async (req, res, next) => {
            try {
                const [username, password] = req.headers.authorization.split(' ');
                if (!username || !password) return res.status(400).send({ status: 400, message: 'Invalid Authorization' });
                if (!username) return res.status(400).send({ status: 400, message: 'Invalid Authorization' });
                const Token = await this.app.localdb.AuthToken.findOne({ where: { username } });
                if (!Token) return res.status(400).send({ status: 400, message: 'User not found' });
                if (Token.password !== password) return res.status(403).send({ status: 403, message: 'Incorrect Authorization Key' });
                next();
            } catch (e) {
                console.log(e);
                res.status(500).send(e);
            }
        });
        this.route.post('/vote', async (req, res) => {
            try {
                const [username,] = req.headers.authorization.split(' ');
                if (!this.parse.hasOwnProperty(username)) return res.status(400).send({ status: 400, message: 'idk' });
                const parsed = this.parse[username](req.body);
                if (!parsed.id) return res.status(400).send({ status: 400, message: 'Bad Request' });
                const user = await this.app.db.users.fetch(parsed.id).catch((e) => { throw e; });
                user.addItem('votebox');
                user.addBadge('voter');
                await user.save().catch((e) => { throw e; });
                res.status(200).send(user.toJSON());
            } catch (e) {
                console.log(e);
                res.status(500).send({ status: 500, message: 'Internal Server Error' });
            }
        });
        return this.route;
    }
}

module.exports = API;