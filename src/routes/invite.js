const Route = require('../classes/Route');

class Discord extends Route {
    constructor(app) {
        super(app, '/invite');
        this.endpoint = 'https://discord.com/oauth2/authorize';
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            const client_id = `client_id=${process.env.MODE !== 'DEV' ? process.env.CLIENT_ID : process.env.DEV_CLIENT_ID}`;
            const redirect_uri = `&redirect_uri=${process.env.MODE !== 'DEV' ? process.env.CLIENT_REDIRECT_URI : process.env.DEV_CLIENT_REDIRECT_URI}}`;
            const queries = `?${client_id}&scope=bot&permissions=285599830${encodeURIComponent(redirect_uri)}`
            res.redirect(`${this.endpoint}${queries}`);
        });
        return this.route;
    }
}

module.exports = Discord;