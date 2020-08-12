const Route = require('../classes/Route');
const { Permissions } = require('discord.js');
const { mutualGuilds } = require('../utils/Mutuals');

class Dashboard extends Route {
    constructor(app) {
        super(app, '/dashboard');
    }
    createRoute() {
        this.route.use(this.app.isAuthenticated);
        this.route.get('/', async (req,res) => {
            try {
                const userGuilds = await this.app.api.getUserGuilds(req.user.id).catch((e) => { throw e; });
                const botGuilds = await this.app.api.getGuilds().catch((e) => { throw e; });
                const guilds = mutualGuilds(userGuilds, botGuilds).filter((g) => (new Permissions(g.permissions)).has('MANAGE_GUILD'));
                this.app.renderTemplate('Dashboard.ejs', req, res, { guilds });
            } catch (e) {
                console.error(e);
                res.redirect('/?q=500');
            }
        });
        return this.route;
    }
}


module.exports = Dashboard;