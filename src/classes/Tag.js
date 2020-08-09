class Tag {
    /**
     * 
     * @param {import('./Unicron')} client 
     * @param {{any}} raw 
     */
    constructor(client, raw = {}) {
        this.client = client;
        /**
         * @type {string}
         */
        this.guild_id = raw.guild_id;
        /**
         * @type {string}
         */
        this.name = raw.tag.name;
        /**
         * @type {{any}}
         */
        this.data = raw.tag.data;
    }
    /**
     * @returns {Promise<void>}
     */
    save() {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.server.post(`/api/tag/${payload.guild_id}/${payload.tag_name}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON() {
        return {
            guild_id: this.guild_id,
            tag_name: this.name,
            data: this.data,
        }
    }
}
module.exports = Tag;