const readline = require('readline');
const { BaseClient } = require('discord.js');
const BaseCommand = require('./classes/Command');
const path = require('path');
const fs = require('fs').promises;

class Terminal extends BaseClient {
    /**
     * 
     * @param {import('../classes/App')} app 
     */
    constructor(app) {
        super();
        this.app = app;
        this.commands = [];
    }
    /**
     * @private
     * @param {string} dir 
     */
    async registerCommands(dir) {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const Command = require(path.join(filePath, file));
                if (Command.prototype instanceof BaseCommand) {
                    const instance = new Command(this.app);
                    this.on(instance.name, (...args) => instance.run(...args));
                    this.app.logger.info(`Command '${instance.name}' loaded`, 'Terminal');
                    this.commands.push(instance.name);
                }
            }
        }
    }
    /**
     * Initiate Terminal
     */
    async initiate() {
        await this.registerCommands('./commands');
        this.cli = readline.createInterface({ input: process.stdin, output: process.stdout });
        this.cli.on('line', (message) => {
            const args = message.split(/ +/g);
            const command = args.shift().toLowerCase();
            if (!this.commands.includes(command)) return this.app.logger.error(`Command not found!`, 'Terminal');
            this.emit(command, args.join(' '), args);
        });
    }
}
module.exports = Terminal;