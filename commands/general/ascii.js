const figlet = require('figlet');

const Command = require("../../structures/Command");

module.exports = class AsciiCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ascii',
            type: 'general',
            description: 'Converts text to ASCII art.',
            usage: 'ascii <text>',
            examples: ["ascii Hello!"],
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["ascii"]);

        if (args.join(" ").length > 15) return message.reply(message.guild.lang.COMMANDS.ASCII.tooLong(args.join(" ").length - 15))

        figlet(args.join(" "), (err, data) => {
            if (err) throw err;
            message.channel.send(data, { code: "AsciiArt" })
        })
    }
}