const BaseEvent = require('../../classes/WebSocketEvent');
class Raw extends BaseEvent {
    constructor(app) {
        super(app, 'raw');
    }
    /**
     * 
     * @param {string} eventName 
     * @param {{any}} payload 
     */
    emit(eventName, payload) {
        this.app.ws.emit(eventName, payload);
    }
}
module.exports = Raw;