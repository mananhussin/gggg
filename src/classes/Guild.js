class Guild {
    /**
     * 
     * @param {import('./App')} client 
     * @param {{any}} raw 
     */
    constructor(client, raw = {}) {
        this.client = client;
        /**
         * @type {string}
         */
        this.id = raw.id;
        /**
         * @type {string}
         */
        this.prefix = raw.prefix;
        /**
         * @type {boolean}
         */
        this.premium = raw.premium;
        /**
         * @type {string}
         */
        this.modLogChannel = raw.modLogChannel;
        /**
         * @type {boolean}
         */
        this.autoModeration = raw.autoModeration;
        /**
         * @type {string}
         */
        this.autoModAction = raw.autoModAction;
        /**
         * @type {number}
         */
        this.autoModDuration = raw.autoModDuration;
        /**
         * @type {number}
         */
        this.warnThreshold = raw.warnThreshold;
        /**
         * @type {string}
         */
        this.warnThresholdAction = raw.warnThresholdAction;
        /**
         * @type {number}
         */
        this.warnActionDuration = raw.warnActionDuration;
        /**
         * @type {string}
         */
        this.welcomeChannel = raw.welcomeChannel;
        /**
         * @type {string}
         */
        this.welcomeMessage = raw.welcomeMessage;
        /**
         * @type {boolean}
         */
        this.welcomeEnabled = raw.welcomeEnabled;
        /**
         * @type {string}
         */
        this.farewellChannel = raw.farewellChannel;
        /**
         * @type {string}
         */
        this.farewellMessage = raw.farewellMessage;
        /**
         * @type {boolean}
         */
        this.farewellEnabled = raw.farewellEnabled;
        /**
         * @type {string}
         */
        this.verificationChannel = raw.verificationChannel;
        /**
         * @type {string}
         */
        this.verificationType = raw.verificationType;
        /**
         * @type {string}
         */
        this.verificationRole = raw.verificationRole;
        /**
         * @type {boolean}
         */
        this.verificationEnabled = raw.verificationEnabled;
        /**
         * @type {string}
         */
        this.ticketCategory = raw.ticketCategory;
        /**
         * @type {boolean}
         */
        this.ticketEnabled = raw.ticketEnabled;
        /**
         * @type {string}
         */
        this.dynamicCategory = raw.dynamicCategory;
        /**
         * @type {string}
         */
        this.dynamicRoom = raw.dynamicRoom;
        /**
         * @type {boolean}
         */
        this.dynamicEnabled = raw.dynamicEnabled;
        /**
         * @type {boolean}
         */
        this.inviteFilter = raw.inviteFilter;
        /**
         * @type {boolean}
         */
        this.swearFilter = raw.swearFilter;
        /**
         * @type {boolean}
         */
        this.mentionSpamFilter = raw.mentionSpamFilter;
        /**
         * @type {{}}
         */
        this.data = raw.data;
    }
    /**
     * @returns {Promise<void>}
     */
    save() {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.ws.post(`/api/guild/${payload.id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON() {
        return {
            id: this.id,
            prefix: this.prefix,
            premium: this.premium,
            modLogChannel: this.modLogChannel,
            autoModeration: this.autoModeration,
            autoModAction: this.autoModAction,
            autoModDuration: this.autoModDuration,
            warnThreshold: this.warnThreshold,
            warnThresholdAction: this.warnThresholdAction,
            warnActionDuration: this.warnActionDuration,
            welcomeChannel: this.welcomeChannel,
            welcomeMessage: this.welcomeMessage,
            welcomeEnabled: this.welcomeEnabled,
            farewellChannel: this.farewellChannel,
            farewellMessage: this.farewellMessage,
            farewellEnabled: this.farewellEnabled,
            verificationChannel: this.verificationChannel,
            verificationType: this.verificationType,
            verificationRole: this.verificationRole,
            verificationEnabled: this.verificationEnabled,
            ticketCategory: this.ticketCategory,
            ticketEnabled: this.ticketEnabled,
            dynamicCategory: this.dynamicCategory,
            dynamicRoom: this.dynamicRoom,
            dynamicEnabled: this.dynamicEnabled,
            inviteFilter: this.inviteFilter,
            swearFilter: this.swearFilter,
            mentionSpamFilter: this.mentionSpamFilter,
            data: this.data,
        };
    }
}

module.exports = Guild;