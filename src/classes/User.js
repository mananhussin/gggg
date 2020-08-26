const Leveling = require('../modules/Leveling');

class User {
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
        this.id = raw.id;
        /**
         * @type {number}
         */
        this.balance = raw.balance;
        /**
         * @type {number}
         */
        this.experience = raw.experience;
        /**
         * @type {number}
         */
        this.multiplier = raw.multiplier;
        /**
         * @type {string}
         */
        this.marriage_id = raw.marriage_id;
        /**
         * @type {Array<{item_id:string, amount:number}>}
         */
        this.inventory = raw.inventory;
        /**
         * @type {{badges: Array<string>, premium: boolean}}
         */
        this.data = raw.data;
    }
    get level() {
        let lvl = 0;
        const cur = this.experience;
        for (let i = 0; i < 101; i++) {
            lvl = i;
            if (cur >= Leveling.LevelChart[i] && cur <= Leveling.LevelChart[i + 1]) break;
        }
        return lvl;
    }
    get levelxp() {
        return Leveling.LevelChart[this.level];
    }
    get nextlevel() {
        return this.level + 1;
    }
    get nextlevelxp() {
        return Leveling.LevelChart[this.nextlevel];
    }
    get progress() {
        return ((this.experience - this.levelxp) / (this.nextlevelxp - this.levelxp)) * 100; // (xp - lxp / nxp - lxp) * 100 = n
    }
    get progressbar() {
        return Leveling.ProgressBar(this.progress);
    }
    get progressXP() {
        return this.nextlevelxp - this.experience;
    }
    /**
     * 
     * @param {string} item 
     */
    addItem(item) {
        const cur = this.inventory.find((t) => t.item_id === item);
        if (cur) return cur.amount++;
        this.inventory.push({ item_id: item, amount: 1 });
    }
    /**
     * 
     * @param {string} item 
     */
    removeItem(item) {
        const cur = this.inventory.find((t) => t.item_id === item);
        if (cur && cur.amount > 1) return cur.amount--;
        this.inventory = this.inventory.filter((t) => t.item_id !== item);
    }
    /**
     * 
     * @param {string} item 
     */
    hasItem(item) {
        return !!this.inventory.find((t) => t.item_id === item);
    }
    /**
     * 
     * @param {string} item 
     */
    addBadge(badge) {
        if (!this.data) this.data = {};
        if (!this.data.badges) this.data.badges = [];
        if (!this.data.badges.includes(badge)) this.data.badges.push(badge);
    }
    /**
     * 
     * @param {string} item 
     */
    removeBadge(badge) {
        if (!this.data) this.data = {};
        if (!this.data.badges) this.data.badges = [];
        if (this.data.badges.includes(badge)) this.data.badges = this.data.badges.filter((b) => b !== badge);
    }
    /**
     * 
     * @param {string} item 
     */
    hasBadge(badge) {
        if (!this.data) this.data = {};
        if (!this.data.badges) this.data.badges = [];
        return this.data.badges.includes(badge);
    }
    /**
     * @returns {Promise<void>}
     */
    save() {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.ws.post(`/api/user/${payload.id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON() {
        return {
            id: this.id,
            balance: this.balance,
            experience: this.experience,
            multiplier: this.multiplier,
            marriage_id: this.marriage_id,
            inventory: this.inventory,
            data: this.data,
        }
    }
}

module.exports = User;