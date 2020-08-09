const Component = require('./Component');
const { Collection } = require('discord.js');
class Manager extends Component {
    constructor(app) {
        super(app, 'manager');
        this.cache = new Collection();
    }
}
module.exports = Manager;