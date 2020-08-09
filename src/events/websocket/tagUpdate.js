const BaseEvent = require('../../classes/WebSocketEvent');
const { Collection } = require('discord.js');
const Tag = require('../../classes/Tag');
class tagUpdate extends BaseEvent {
    constructor(app) {
        super(app, 'tagUpdate');
    }
    /**
     * 
     * @param {{}} payload
     */
    emit(payload) {
        if (!this.app.db.tags.cache.has(payload.guild_id)) this.app.db.tags.cache.set(payload.guild_id, new Collection());
        const tags = this.app.db.tags.cache.get(payload.guild_id);
        tags.set(payload.tag.name, new Tag(this.app, payload));
    }
}
module.exports = tagUpdate;