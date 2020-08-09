const BaseEvent = require('../../classes/WebSocketEvent');
class memberDelete extends BaseEvent {
    constructor(app) {
        super(app, 'memberDelete');
    }
    /**
     * 
     * @param {{ guild_id:string, member_id:string }} payload
     */
    emit(payload) {
        if (!this.app.db.members.cache.has(payload.guild_id)) return;
        const members = this.app.db.members.cache.get(payload.guild_id);
        if (members.has(payload.member_id)) members.delete(payload.member_id);
    }
}
module.exports = memberDelete;