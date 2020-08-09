const BaseEvent = require('../../classes/WebSocketEvent');
class tagDelete extends BaseEvent {
    constructor(app) {
        super(app, 'tagDelete');
    }
    /**
     * 
     * @param {{ guild_id:string, name:string }} payload
     */
    emit(payload) {
        if (!this.app.db.tags.cache.has(payload.guild_id)) return;
        const tags = this.app.db.tags.cache.get(payload.guild_id);
        if (tags.has(payload.name)) tags.delete(payload.name);
    }
}
module.exports = tagDelete;