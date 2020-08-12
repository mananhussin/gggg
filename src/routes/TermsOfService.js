const Route = require('../classes/Route');

class ToS extends Route {
    constructor(app) {
        super(app, '/terms-of-service');
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            this.app.renderTemplate('ToS.ejs', req, res);
        });
        return this.route;
    }
}

module.exports = ToS;