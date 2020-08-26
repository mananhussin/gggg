const Command = require('../classes/Command');

class Auth extends Command {
    constructor(app) {
        super(app, 'auth');
    }
    /**
     * 
     * @param {string} content 
     * @param {Array<string>} args 
     */
    async run(content, args) {
        const [action, username, password] = args;
        try {
            switch (action) {
                case 'list': {
                    const all = await this.app.localdb.AuthToken.findAll();
                    console.log(all.map((m) => m.toJSON()));
                    break;
                }
                case 'create': {
                    if (!username || !password) return console.log('missing parameters <Username> or <Password>');
                    const cur = await this.app.localdb.AuthToken.findOne({ where: { username }});
                    if (cur) return console.log('user already exist');
                    await this.app.localdb.AuthToken.create({ username, password });
                    console.log('User created');
                    break;
                }
                case 'edit': {
                    if (!username || !password) return console.log('missing parameters <Username> or <Password>');
                    await this.app.localdb.AuthToken.update({ password }, { where: { username } });
                    console.log('user edited');
                    break;
                }
                case 'delete': {
                    if (!username) return console.log('missing parameter <Username>');
                    await this.app.localdb.AuthToken.destroy({ where: { username } });
                    console.log('User deleted');
                    break;
                }
                default: {
                    console.log('invalid arguments');
                }
            }
        } catch (e) {
            this.app.logger.error(e.message, 'Terminal');
            console.log(e);
        }
    }
}

module.exports = Auth;