const BaseEvent = require('../../classes/WebSocketEvent');
const User = require('../../classes/User');
class userUpdate extends BaseEvent {
    constructor(app) {
        super(app, 'userUpdate');
    }
    /**
     * 
     * @param {{}} payload
     */
    emit(payload) {
        this.app.db.users.cache.set(payload.id, new User(this.app, payload));
    }
}
module.exports = userUpdate;