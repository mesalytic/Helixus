const isgd = require('isgd');
const Command = require("../../structures/Command");

module.exports = class ShortenCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'shorten',
            type: 'general',
            description: 'Shortens the specified link.',
            usage: 'shorten <link> [name of the link]',
            examples: ["shorten google.com google (returns is.gd/google)"],
        });
    }
    async run(message, args) {
        if (!args[0]) return this.bot.commands.get('help').run(message, ["shorten"]);
        if (!args[1]) {
            isgd.shorten(args[0], res => {
                if (res.match("Error: ")) return message.reply(`❌ - ${res.substring(7)}`)
                message.channel.send(message.guild.lang.COMMANDS.SHORTEN.success(res))
            });
        } else {
            isgd.custom(args[0], args[1], res => {
                if (res.match("Error: ")) return message.reply(`❌ - ${res.substring(7)}`)
                message.channel.send(message.guild.lang.COMMANDS.SHORTEN.success(res))
            })
        }
    }
}