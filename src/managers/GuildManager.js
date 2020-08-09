const BaseManager = require('../classes/Manager');
class GuildManager extends BaseManager {
    constructor(app) {
        super(app);
        /**
         * @type {import('discord.js').Collection<string, import('../classes/Guild')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Guild')>}
     * @param {string} guild_id
     */
    fetch(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(guild_id)) return resolve(this.cache.get(guild_id));
            await this.app.ws.get(`/api/guild/${guild_id}`).catch(reject);
            resolve(this.cache.get(guild_id));
        });
    }
    /**
     * @returns {Promise<void>}
     * @param {string} guild_id
     */
    delete(guild_id) {
        return new Promise(async (resolve, reject) => {
            await this.app.ws.delete(`/api/guild/${guild_id}`).catch(reject);
            resolve();
        });
    }
}
module.exports = GuildManager;