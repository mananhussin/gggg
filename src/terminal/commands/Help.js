const Command = require('../classes/Command');

class Help extends Command {
    constructor(app) {
        super(app, 'help');
    }
    /**
     * 
     * @param {string} content 
     * @param {Array<string>} args 
     */
    run(content, args) {
        console.log(`
Commands:
\tauth - Authorization Credentials
\t\t- auth list
\t\t- auth create <Username> <Password>
\t\t- auth edit <Username> <New Password>
\t\t- auth delete <Username>
        `)
    }
}

module.exports = Help;