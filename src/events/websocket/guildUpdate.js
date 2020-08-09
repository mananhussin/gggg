const BaseEvent = require('../../classes/WebSocketEvent');
const Guild = require('../../classes/Guild');
class guildUpdate extends BaseEvent {
    constructor(app) {
        super(app, 'guildUpdate');
    }
    /**
     * 
     * @param {{}} payload
     */
    emit(payload) {
        this.app.db.guilds.cache.set(payload.id, new Guild(this.app, payload));
    }
}
module.exports = guildUpdate;