const Component = require('./Component');
const { Router } = require('express');
class Route extends Component {
    constructor(app, path) {
        super(app, 'route');
        this.path = path;
        this.route = Router();
    }
}
module.exports = Route;