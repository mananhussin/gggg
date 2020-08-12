const Route = require('../classes/Route');

class Commands extends Route {
    constructor(app) {
        super(app, '/commands');
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            this.app.renderTemplate('Commands.ejs', req, res);
        });
        return this.route;
    }
}

module.exports = Commands;