const Command = require("../../structures/Command");
const { randomInt } = require('../../structures/Utils')

module.exports = class DiceCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'dice',
            description: 'Rolls a dice within a 1-max value of your choice.',
            usage: 'dice <maxNum>',
            examples: ["dice 569"],
            type: 'fun'
        });
    }

    async run(message, args) {
        if (!args[0] || isNaN(args[0])) return this.bot.commands.get("help").run(message, ["dice"]);
        return message.channel.send(message.guild.lang.COMMANDS.DICE.success(randomInt(1, Number(args[0]))));
    }
}