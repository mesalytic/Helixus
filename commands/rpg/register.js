const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { rpgPlayer } = require("../../structures/DatabaseCollections");

module.exports = class RegisterCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'register',
            description: "Register",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        message.channel.send(`V - Welcome to the Adventure, ${message.author}!\n\nI recommend you start completing the tutorial quest line, it will help you understand the basics of this adventure!\nYou can start it using \`am!quest\`\n\nI'm pretty sure you'll do amazing, good luck adventurer!`)
        const account = {
            username: message.author.username,
            userId: message.author.id,
        };
        const newUser = new this.bot.mongoDB.Rpg({
            account,
        });
        return newUser.save();
    }
}