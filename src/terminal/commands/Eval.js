const Command = require('../classes/Command');

class Eval extends Command {
    constructor(app) {
        super(app, 'eval');
    }
    /**
     * 
     * @param {string} content 
     * @param {Array<string>} args 
     */
    run(content, args) {
        console.log(`
        lol
        `)
    }
}

module.exports = Eval;