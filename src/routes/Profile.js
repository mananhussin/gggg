const Route = require('../classes/Route');

class Profile extends Route {
    constructor(app) {
        super(app, '/profile');
    }
    createRoute() {
        this.route.use(this.app.isAuthenticated);
        this.route.get('/', async (req, res) => {
            try {
                let data = await this.app.db.users.fetch(req.user.id).catch((e) => { throw e; });
                if (!data) data = await this.app.db.users.fetch(req.user.id).catch((e) => { throw e; });
                this.app.renderTemplate('Profile.ejs', req, res, { data });
            } catch (err) {
                console.error(err);
                this.app.renderTemplate('500.ejs', req, res, {}, 500);
            }
        });
        return this.route;
    }
}

module.exports = Profile;