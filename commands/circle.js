module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  const Canvas = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');
  

  const { body } = await request.get(url);
  const data = await Canvas.loadImage(body);
  const dimensions = data.width <= data.height ? data.width : data.height;
  const canvas = Canvas.createCanvas(dimensions, dimensions);
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));

  message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: "circle.png" }] })
};
module.exports.help = {
  name: "circle",
  catégorie: "Images",
  helpcaté: "images",
};
