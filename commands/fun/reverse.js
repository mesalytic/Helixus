const { stripIndents } = require("common-tags");
const { Util } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class ReverseCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'reverse',
            usage: 'reverse <text>',
            description: 'Reverses the specified text.',
            examples: ["reverse Hello!"],
            type: 'fun'
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["reverse"]);
        return message.channel.send(stripIndents`
        ${Util.escapeMarkdown(Util.removeMentions(args.join(' ').split('').reverse().join('')))}

        - **${message.author.tag}**
        `)
    }
}