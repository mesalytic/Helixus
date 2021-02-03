const { evaluate } = require("mathjs");
const Command = require("../../structures/Command");

module.exports = class AfkCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'math',
            type: 'general',
            description: 'Solves the specified equation.',
            usage: 'math <equation>',
            examples: ["math 15+56", "math 69*23", "math 88/2", "math 9^2"],
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["math"]);
        if (args.join(" ").match(":")) return message.reply(message.guild.lang.COMMANDS.MATH.invalidSyntax);

        message.channel.send(message.guild.lang.COMMANDS.MATH.answer(evaluate(args.join(" "))))
    }
}