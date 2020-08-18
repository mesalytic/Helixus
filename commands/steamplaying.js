module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  let gameA = args.slice(0).join(" ");
  var game;
  if (!gameA) { return message.reply(bot.lang.images.steamplaying.nogame); } else if (gameA.length > 20) { return message.reply(bot.lang.images.steamplaying.toolong); } else { game = gameA; }

  const m = await message.channel.send(bot.lang.images.steamplaying.wait);

  const Canvas = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');
  const { shortenText } = require('../util/Util')

  Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, { family: 'Noto' });
  Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, { family: 'Noto' });
  Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, { family: 'Noto' });

  const base = await Canvas.loadImage(`${process.cwd()}/assets/images/steam-now-playing-classic.png`);

  const { body } = await request.get(message.author.avatarURL({ format: "png", size: 512 }));
  const data = await Canvas.loadImage(body);
  const canvas = Canvas.createCanvas(base.width, base.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(base, 0, 0);
  ctx.drawImage(data, 21, 21, 32, 32);
  ctx.fillStyle = '#90ba3c';
  ctx.font = '10px Noto';
  ctx.fillText(message.author.username, 63, 26);
  ctx.fillText(shortenText(ctx, game, 160), 63, 54);

  const attachment = canvas.toBuffer();

  message.channel.send({ files: [{ attachment: attachment, name: "steamplaying.png" }] })
};
module.exports.help = {
  name: "steamplaying",
  catégorie: "Images",
  helpcaté: "images",
};
