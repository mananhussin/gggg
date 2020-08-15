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
        this.level = 0;
        for (let i = 0; i < 101; i++) {
            this.lvl = i;
            if (this.experience >= Leveling.LevelChart[i] && this.experience <= Leveling.LevelChart[i + 1]) break;
        }
        this.levelxp = Leveling.LevelChart[this.level];
        this.nextlevel = this.level + 1;
        this.nextlevelxp = Leveling.LevelChart[this.nextlevel];
        this.progress = ((this.experience - this.levelxp / (this.nextlevelxp- this.levelxp))) * 100;
        this.progressbar = Leveling.ProgressBar(this.progress);
        this.progressXP = this.nextlevelxp - this.experience;
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
        if (cur && cur.amount >= 1) return cur.amount--;
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
        if (!this.data.badges.includes(badge)) this.data.badges.push(badge);
    }
    /**
     * 
     * @param {string} item 
     */
    removeBadge(badge) {
        if (this.data.badges.includes(badge)) this.data.badges = this.data.badges.filter((b) => b !== badge);
    }
    /**
     * 
     * @param {string} item 
     */
    hasBadge(badge) {
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