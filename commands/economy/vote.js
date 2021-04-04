const Command = require("../../structures/Command");

module.exports = class VoteCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'vote',
            description: "Vote and win 450 coins every 12h.",
            type: 'economy'
        });
    }

    async run(message) {
        message.channel.send(message.guild.lang.COMMANDS.VOTE.vote)
    }
}