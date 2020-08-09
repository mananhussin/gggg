const BaseEvent = require('../../classes/WebSocketEvent');
class Ready extends BaseEvent {
    constructor(app) {
        super(app, 'ready');
    }
    emit() {
        this.app.logger.info(`Database Connection Established!`);
    }
}
module.exports = Ready;