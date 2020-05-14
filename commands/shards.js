module.exports.run = async (bot, message, args, con) => {
  const promises = [
    bot.shard.fetchClientValues("guilds.cache.size"),
    bot.shard.broadcastEval("this.ws.status"),
  ];

  Promise.all(promises).then(res => {
    var stat;
    let msg = "";

    for (let i = 0; i < bot.shard.count; i++) {
      switch (res[1][i]) {
        case 0:
          stat = "CONNECTED";
          break;
        case 1:
          stat = "CONNECTING";
          break;
        case 2:
          stat = "RECONNECTING";
          break;
        case 3:
          stat = "IDLE";
          break;
        case 4:
          stat = "NEARLY";
          break;
        case 5:
          stat = "DISCONNECTED";
          break;
      }

      msg += `Shard ${i + 1} | Servers : ${res[0][i]} | Status : ${stat}\n`;
    }

    message.channel.send(msg);
  });
};
module.exports.help = {
  name: "shards",
  catégorie: "Infos",
  helpcaté: "infos",
};
