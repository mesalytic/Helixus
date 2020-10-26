const Command = require("../../structures/Command");

module.exports = class UserInfoCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'autorole',
            type: 'administration',
        });
    }

    async run(message, args) {
        message.reply("Soon");
    }
}