module.exports.run = async (bot, message, args, con) => {
  const { stripIndents } = require("common-tags");
  const { verify } = require("../util/Util");
  const playing = new Set();

  const opponent = message.mentions.users.first();
  if (!opponent) return message.reply(bot.lang.fun.tictactoe.noplayer);
  if (opponent.bot) return message.reply(bot.lang.fun.tictactoe.bot);
  if (opponent.id === message.author.id)
    return message.reply(bot.lang.fun.tictactoe.yourself);
  if (playing.has(message.channel.id))
    return message.reply(bot.lang.fun.tictactoe.alreadyplaying);
  playing.add(message.channel.id);
  try {
    const str = bot.lang.fun.tictactoe.asking;
    const res = str
      .replace("${opponent}", opponent)
      .replace("${message.author}", message.author);
    await message.channel.send(res);
    const verification = await verify(message.channel, opponent);
    if (!verification) {
      playing.delete(message.channel.id);
      return message.channel.send(bot.lang.fun.tictactoe.notaccepted);
    }
    const sides = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    const taken = [];
    let userTurn = true;
    let winner = null;
    while (!winner && taken.length < 9) {
      const user = userTurn ? message.author : opponent;
      const sign = userTurn ? "❌" : "⭕";
      await message.channel.send(stripIndents`
					${user}, ${bot.lang.fun.tictactoe.side}
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
                `);
      const filter = res => {
        const choice = res.content;
        return (
          res.author.id === user.id &&
          sides.includes(choice) &&
          !taken.includes(choice)
        );
      };
      const turn = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
      });
      if (!turn.size) {
        await message.channel.send(bot.lang.fun.tictactoe.timesup);
        userTurn = !userTurn;
        continue;
      }
      const choice = turn.first().content;
      sides[Number.parseInt(choice, 10)] = sign;
      taken.push(choice);
      if (verifyWin(sides)) winner = userTurn ? message.author : opponent;
      userTurn = !userTurn;
    }
    playing.delete(message.channel.id);
    return message.channel.send(
      winner
        ? `${bot.lang.fun.tictactoe.win}${winner} !\`\`\`
        ${sides[0]} | ${sides[1]} | ${sides[2]}
        —————————
        ${sides[3]} | ${sides[4]} | ${sides[5]}
        —————————
        ${sides[6]} | ${sides[7]} | ${sides[8]}
        \`\`\``
        : bot.lang.fun.tictactoe.tie,
    );
  } catch (err) {
    playing.delete(message.channel.id);
    throw err;
  }
};

function verifyWin(sides) {
  return (
    (sides[0] === sides[1] && sides[0] === sides[2]) ||
    (sides[0] === sides[3] && sides[0] === sides[6]) ||
    (sides[3] === sides[4] && sides[3] === sides[5]) ||
    (sides[1] === sides[4] && sides[1] === sides[7]) ||
    (sides[6] === sides[7] && sides[6] === sides[8]) ||
    (sides[2] === sides[5] && sides[2] === sides[8]) ||
    (sides[0] === sides[4] && sides[0] === sides[8]) ||
    (sides[2] === sides[4] && sides[2] === sides[6])
  );
}
module.exports.help = {
  name: "tictactoe",
  catégorie: "Fun",
  helpcaté: "fun",
};
