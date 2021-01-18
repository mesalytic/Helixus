const Command = require("../../structures/Command");

module.exports = class SelectCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'select',
            usage: 'select [subject]',
            description: 'Selects someone randomly in the server.',
            examples: ["select Wins a free Nitro!"],
            type: 'fun'
        });
    }

    async run(message, args) {
        let randomMember = message.guild.members.cache.random(1)[0].user.tag;

        if (!args[0]) return message.channel.send(message.guild.lang.COMMANDS.SELECT.noSubject(randomMember));
        else {
            let subject = args.join(" ");
            return message.channel.send(message.guild.lang.COMMANDS.SELECT.subject(subject, randomMember));
        }
    }
}