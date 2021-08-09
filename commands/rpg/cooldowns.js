const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { allCooldowns } = require("../../structures/Utils");

module.exports = class CooldownsCommand extends Command {
    constructor(bot) {
            super(bot, {
                name: 'cooldowns',
                description: "Shows an overview of your current cooldowns.",
                type: 'rpg'
            });
        }
        /**
         * @param {Message} message
         */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        const overview = allCooldowns(dbUser);
        return message.channel.send(overview);
    }
}