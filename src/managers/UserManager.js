const BaseManager = require('../classes/Manager');
class UserManager extends BaseManager {
    constructor(app) {
        super(app);
        /**
         * @type {import('discord.js').Collection<string, import('../classes/User')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/User')>}
     * @param {string} user_id
     */
    fetch(user_id) {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(user_id)) return resolve(this.cache.get(user_id));
            await this.app.ws.get(`/api/user/${user_id}`).catch(reject);
            resolve(this.cache.get(user_id));
        });
    }
    /**
     * @returns {Promise<void>}
     * @param {string} user_id
     */
    delete(user_id) {
        return new Promise(async (resolve, reject) => {
            await this.app.ws.delete(`/api/user/${user_id}`).catch(reject);
            resolve();
        });
    }
}
module.exports = UserManager;