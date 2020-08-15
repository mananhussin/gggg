const fetch = require('node-fetch');

class Bot {
    constructor() {
        this.uri = process.env.BOT_URI;
    }
    /**
     * @returns {string[]}
     */
    async getGuilds() {
        try {
            const response = await fetch.default(`${this.uri}/api/guilds`);
            if (response.status >= 400) throw response;
            return response.json();
        } catch (e) {
            throw e;
        }
    }
    /**
     * @returns {Promise<{id:string,name:string,type:string}[]>}
     * @param {string} id 
     */
    async getGuildChannels(id) {
        try {
            const response = await fetch.default(`${this.uri}/api/guild/${id}/channels`);
            if (response.status >= 400) throw response;
            return response.json();
        } catch (e) {
            throw e;
        }
    }
    /**
     * @returns {Promise<{id:string,name:string}[]>}
     * @param {string} id 
     */
    async getGuildRoles(id) {
        try {
            const response = await fetch.default(`${this.uri}/api/guild/${id}/roles`);
            if (response.status >= 400) throw response;
            return response.json();
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Bot;