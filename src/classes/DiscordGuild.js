class DiscordGuild {
    constructor(data = {}) {
        const { id, name, icon, channels, roles } = data;
        /**
         * @type {string}
         */
        this.id = id;
        /**
         * @type {string}
         */
        this.name = name;
        /**
         * @type {string}
        */
        this.icon = icon;
        this.acro = this.name.split(/ +/g).map((n) => n[0]).join('');
        this.iconURL = this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}` : `https://dummyimage.com/128x128/23272A/ffffff.png&text=${this.acro}`;
        /**
         * @type {{id:string,name:string,type:string}[]}
         */
        this.channels = channels;
        /**
         * @type {{id:string,name:string}[]}
         */
        this.roles = roles;
    }
}

module.exports = DiscordGuild;