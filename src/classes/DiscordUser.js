const { Permissions } = require('discord.js');

class DiscordUser {
    constructor(data = {}) {
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.avatarURL = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.tag = `${this.username}#${this.discriminator}`;
        this.guilds = data.guilds.filter((g) => (new Permissions(g.permissions)).has('MANAGE_GUILD'));
    }
}

module.exports = DiscordUser;