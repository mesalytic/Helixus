const Command = require("../../structures/Command");

module.exports = class ShardsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'shards',
            description: 'Displays stats about the shards.',
            type: 'info'
        });
    }

    async run(message) {
        const promises = [this.bot.shard.fetchClientValues("guilds.cache.size"), this.bot.shard.broadcastEval("this.ws.status")];

        Promise.all(promises).then(res => {
            let stat;
            let msg = "";

            for (let i = 0; i < this.bot.shard.count; i++) {
                switch (res[1][i]) {
                  case 0:
                    stat = message.guild.lang.COMMANDS.SHARDS.connected;
                    break;
                  case 1:
                    stat = message.guild.lang.COMMANDS.SHARDS.connecting;
                    break;
                  case 2:
                    stat = message.guild.lang.COMMANDS.SHARDS.reconnecting;
                    break;
                  case 3:
                    stat = message.guild.lang.COMMANDS.SHARDS.idle;
                    break;
                  case 4:
                    stat = message.guild.lang.COMMANDS.SHARDS.nearly;
                    break;
                  case 5:
                    stat = message.guild.lang.COMMANDS.SHARDS.disconnected;
                    break;
                }
          
                msg += message.guild.lang.COMMANDS.SHARDS.finalMessage(i + 1, res[0][i], stat);
              }
              message.channel.send(msg);
        })
    }
}