module.exports.run = async (bot, message, args, con) => {
  bot.shard.broadcastEval("this.shard.id").then(u => {
    bot.shard.broadcastEval("this.guilds.size").then(sh => {
      bot.shard.broadcastEval("this.ws.status").then(st => {
        let stat;
        var ststr = String(st).split("\n");
        var starray = JSON.parse("[" + ststr + "]");
        let m = "";
        const sn = 0;

        for (let i = 0; i < bot.shard.count; i++) {
          if (starray[i] === 0) stat = "CONNECTED";
          else if (starray[i] === 1) stat = "CONNECTING";
          else if (starray[i] === 2) stat = "RECONNECTING";
          else if (starray[i] === 3) stat = "IDLE";
          else if (starray[i] === 4) stat = "NEARLY";
          else if (starray[i] === 5) stat = "DISCONNECTED";
          else stat = "UNAVAILABLE";

          var ustr = String(u).split("\n");
          var uarray = JSON.parse("[" + ustr + "]");
          var shstr = String(sh).split("\n");
          var sharray = JSON.parse("[" + shstr + "]");

          let servs;
          if (!sharray[i] || sharray[i] === undefined) servs = 0;
          else servs = sharray[i];
          // sn += sharray[i];
          m += `Shard ${i + 1} | Servers : ${servs} | Status : ${stat}\n`;
        }
        message.channel.send(m);
      });
    });
  });
};
module.exports.help = {
  name: "shards",
  catégorie: "Infos",
  helpcaté: "infos"
};
