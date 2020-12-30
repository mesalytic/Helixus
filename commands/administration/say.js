const {
    MessageEmbed, Util
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class SayCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'say',
            usage: 'say <text>',
            description: 'Repeat the text you provided.',
            type: 'administration',
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    }

    async run(message, args) {
  if (!args[0]) return this.bot.commands.get("help").run(message, ["say"]);
  if (args.join(" ").length > 1950) return message.reply(message.guild.lang.COMMANDS.SAY.tooMuch)

  try {
    message.delete();
    message.channel.send(`${Util.escapeMarkdown(Util.removeMentions(args.join(" ")))}\n\n\n**By ${message.author.tag}**`)
  } catch(e) {
    throw e;
  }
    }
}