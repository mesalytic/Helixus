const Command = require("../../structures/Command");

module.exports = class LevelUpCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'levelup',
      description: 'Lets you configure the levelup message content/channel target for your server.',
      type: 'levels',
      usage: 'levelup <channel/message> <#channel / lvlup message>',
      examples: ['levelup channel 684654665465444', 'levelup channel msgChannel', 'levelup message **{user}** is now level **{level}**!'],
      notes: '__**Channel Parameter**__:\nIf you want it to be displayed where the user has levelled up, type `msgChannel`.\n\n__**Message Parameters**__:\nHere is the list of the tags you can use:\n{user} - mentions the user\n{username} - displays the username\n{server} - displays the server name\n{level} - displays the obtained level',
      userPermissions: ["MANAGE_GUILD"]
    });
  }

  async run(message, args) {
    if (!args[0]) return this.bot.commands.get("help").run(message, ["levelup"]);

    if (args[0] === "channel") {
      let chanName = args.slice(1);
      if (!chanName) return message.reply('[X] - Please specify a channel name, ID, or mention!')
      let chan = message.guild.channels.cache.find(chan => (chan.name === chanName.toString()) || (chan.id === chanName.toString().replace(/[^\w\s]/gi, '')));

      if (!chan) return message.reply('[X] - This channel doesn\'t exist.')
      else {
        this.bot.db.query(`SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`, (err, rows) => {
          if (!rows[0]) return message.reply('[X] - Levelling is not enabled on this server. See `am!help toggle`.');
          else {
            this.bot.db.query(`UPDATE LevelsConfig SET lvlupChannelID='${chan.id}' WHERE guildID='${message.guild.id}'`);
            return message.channel.send(`[V] - Level up messages will now be sent to ${chan}!`)
          }
        })
      }
    }

    if (args[0] === "message") {
      let content = args.slice(1).join(" ");

      if (!content) return message.reply('[X] - You haven\'t specified a levelup message content. Please check `am!help levelup` to see which tags you can use inside of your levelup message.')

      this.bot.db.query(`SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`, (err, rows) => {
        if (!rows[0]) return message.reply('[X] - Levelling is not enabled on this server. See `am!help toggle`.');
        else {
          this.bot.db.query(`UPDATE LevelsConfig SET lvlupMessage='${content}' WHERE guildID='${message.guild.id}'`);
          return message.channel.send(`[V] - This server's levelup message has been updated!`)
        }
      })
    }
  }
}