class Component {
    /**
     * 
     * @param {import('./App')} app 
     * @param {string} name 
     */
    constructor(app, name) {
        this.app = app;
        this.component_name = name;
    }
}
module.exports = Component;