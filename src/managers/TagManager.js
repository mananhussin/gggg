const BaseManager = require('../classes/Manager');
const { Collection } = require('discord.js');
const Tag = require('../classes/Tag');

class TagManager extends BaseManager {
    constructor(app) {
        super(app);
        /**
         * @type {import('discord.js').Collection<string, import('discord.js').Collection<string, import('../classes/Tag')>>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Tag')>}
     * @param {string} guild_id
     * @param {string} tag_name
     */
    fetch(guild_id, tag_name) {
        if (!this.cache.has(guild_id)) this.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            await this.app.ws.get(`/api/tag/${guild_id}/${tag_name}`).catch(reject);
            resolve(this.cache.get(guild_id).get(tag_name));
        });
    }
    /**
     * @returns {Promise<Collection<string, import('../classes/Tag')>}
     * @param {string} guild_id
     */
    fetchAll(guild_id) {
        if (!this.cache.has(guild_id)) this.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            /**
             * @type {[{guild_id:string, tag: { name:string, data: {}}}]}
             */
            const rawTags = await this.app.ws.get(`/api/tags/${guild_id}`).catch(reject);
            const tags = this.cache.get(guild_id);
            rawTags.forEach((t) => {
                tags.set(t.tag.name, new Tag(this.app, t));
            });
            resolve(tags);
        });
    }
}

module.exports = TagManager;