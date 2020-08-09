const BaseEvent = require('../../classes/WebSocketEvent');
class Disconnect extends BaseEvent {
    constructor(app) {
        super(app, 'disconnect');
    }
    emit() {
        this.app.logger.warn(`[NOTICE] Database Connection Disconnected`);
    }
}
module.exports = Disconnect;