const Route = require('../classes/Route');

class ToS extends Route {
    constructor(app) {
        super(app, '/privacy-policy');
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            this.app.renderTemplate('Policy.ejs', req, res);
        });
        return this.route;
    }
}

module.exports = ToS;