const BaseEvent = require('../../classes/WebSocketEvent');
const { Collection } = require('discord.js');
const Member = require('../../classes/Member');
class memberUpdate extends BaseEvent {
    constructor(app) {
        super(app, 'memberUpdate');
    }
    /**
     * 
     * @param {{}} payload
     */
    emit(payload) {
        if (!this.app.db.members.cache.has(payload.guild_id)) this.app.db.members.cache.set(payload.guild_id, new Collection());
        const members = this.app.db.members.cache.get(payload.guild_id);
        members.set(payload.member.id, new Member(this.app, payload));
    }
}
module.exports = memberUpdate;