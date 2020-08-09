const BaseManager = require('../classes/Manager');
const { Collection } = require('discord.js');
const Member = require('../classes/Member');
class MemberManager extends BaseManager {
    constructor(app) {
        super(app);
        /**
         * @type {import('discord.js').Collection<string, import('discord.js').Collection<string, import('../classes/Member')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Member')>}
     * @param {string} guild_id
     * @param {string} member_id
     */
    fetch(guild_id, member_id) {
        if (!this.cache.has(guild_id)) this.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            await this.app.ws.get(`/api/member/${guild_id}/${member_id}`).catch(reject);
            resolve(this.cache.get(guild_id).get(member_id));
        });
    }
    /**
     * @returns {Promise<Collection<string, import('../classes/Member')>}
     * @param {string} guild_id
     */
    fetchAll(guild_id) {
        if (!this.cache.has(guild_id)) this.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            /**
             * @type {{guild_id:string, member: { id:string, data: {}}}[]}
             */
            const rawmembers = await this.app.ws.get(`/api/members/${guild_id}`).catch(reject);
            const members = this.cache.get(guild_id);
            rawmembers.forEach((t) => {
                members.set(t.member.id, new Member(this.app, t));
            });
            resolve(members);
        });
    }
}

module.exports = MemberManager;