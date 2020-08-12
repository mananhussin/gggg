const Route = require('../classes/Route');

class Discord extends Route {
    constructor(app) {
        super(app, '/discord');
    }
    createRoute() {
        this.route.get('/', (req, res) => {
            res.redirect('https://discord.gg/RgmjBqY');
        });
        return this.route;
    }
}

module.exports = Discord;