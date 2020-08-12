const fetch = require('node-fetch');
class Wrapper {
    /**
     * @param {import('../classes/App')} app
     */
    constructor(app) {
        this.app = app;
        this.token = process.env.MODE !== 'DEV' ? process.env.CLIENT_TOKEN : process.env.DEV_CLIENT_TOKEN;
    }
    async getGuilds() {
        const response = await fetch.default('https://discord.com/api/v6/users/@me/guilds', {
            method: 'GET',
            headers: {
                Authorization: `Bot ${this.token}`
            }
        });
        return response.json();
    }
    async getUserGuilds(user_id) {
        const { accessToken } = this.app.users.get(user_id);
        if (!accessToken) throw new Error(`${user_id} has no credentials at the database`);
        const response = await fetch.default(`https://discord.com/api/v6/users/@me/guilds`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.json();
    }
}
module.exports = Wrapper;