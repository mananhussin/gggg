const BaseEvent = require('../../classes/WebSocketEvent');
class userDelete extends BaseEvent {
    constructor(app) {
        super(app, 'userUpdate');
    }
    /**
     * 
     * @param {string} payload_id
     */
    emit(payload_id) {
        if (this.app.db.users.cache.has(payload_id)) this.app.db.users.cache.delete(payload_id);
    }
}
module.exports = userDelete;