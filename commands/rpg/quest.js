const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const questHandler = require("../../structures/Quests/questHandler");

module.exports = class QuestCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'quest',
            description: "Displays available quests.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     * @param {String} args
     */
    async run(message, args) {
        const questName = args.join(" ");

        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        questHandler(dbUser, questName).then((res) => {
            message.channel.send(`${message.author}: ${res}`)
        })
    }
}