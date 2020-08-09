class Member {
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
        this.member_id = raw.member.id;
        /**
         * @type {{ warnings: [{reason:string, moderator:string, date:string, case:number}], captcha:string, cases:number}}
         */
        this.data = raw.member.data;
    }
    /**
     * 
     * @param {string} reason 
     * @param {import('discord.js').User} moderator 
     */
    addWarn(reason, moderator) {
        if (!this.data) this.data = {};
        if (!this.data.warnings) this.data.warnings = [];
        if (!this.data.cases) this.data.cases = 1;
        const index = this.data.cases;
        this.data.warnings.push({
            reason,
            moderator: `${moderator.tag} / ${moderator.id}`,
            case: index,
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        });
        this.data.cases++;
        return index;
    }
    /**
     * 
     * @param {number} index 
     */
    removeWarn(index) {
        this.data.warnings = this.data.warnings.filter((w) => w.case !== index);
    }
    /**
     * @returns {Promise<void>}
     */
    save() {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.server.post(`/api/member/${payload.guild_id}/${payload.member_id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON() {
        return {
            guild_id: this.guild_id,
            member_id: this.member_id,
            data: this.data,
        }
    }
}
module.exports = Member;