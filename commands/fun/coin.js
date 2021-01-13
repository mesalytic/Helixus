const Command = require("../../structures/Command");
const sides = {
    fr: ["pile", "face"],
    en: ["heads", "tails"]
};
module.exports = class ChooseCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'coin',
            usage: 'coin',
            description: 'Heads or tails?',
            usage: 'coin',
            type: 'fun'
        });
    }

    async run(message, args) {
        return message.channel.send(message.guild.lang.COMMANDS.COIN.success(sides[message.guild.lang.code][Math.floor(Math.random() * sides[message.guild.lang.code].length)]));
    }
}