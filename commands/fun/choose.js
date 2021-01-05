const Command = require("../../structures/Command");

module.exports = class ChooseCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'choose',
            usage: 'choose',
            description: 'Allows you to choose between multiple choices.',
            usage: 'choose <ch1 | ch2 | etc...>',
            examples: ["choose Sleeping | Netflix"],
            type: 'fun'
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["choose"])
        const chooseOptions = args.slice(0).join(" ").split(" | ");
        if (chooseOptions.length < 2) return this.bot.commands.get("help").run(message, ["choose"])
        
        return message.channel.send(message.guild.lang.COMMANDS.CHOOSE.success(chooseOptions[Math.floor(Math.random() * chooseOptions.length)]))
    }
}