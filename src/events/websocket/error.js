const BaseEvent = require('../../classes/WebSocketEvent');
class ErrorEvent extends BaseEvent {
    constructor(app) {
        super(app, 'error');
    }
    /**
     * 
     * @param {*} err 
     */
    emit(err) {
        this.app.logger.error(err);
    }
}
module.exports = ErrorEvent;