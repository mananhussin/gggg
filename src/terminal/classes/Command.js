class Command {
    /**
     * 
     * @param {import('../../classes/App')} app
     * @param {string} name
     * @param {Object<string, any>} options
     */
    constructor(app, name, options) {
        this.app = app;
        this.name = name;
        this.options = options;
    }
}

module.exports = Command;