module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");
  const { createCanvas, loadImage } = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  const base = await loadImage(`${process.cwd()}/assets/images/brazzers.png`);
			const { body } = await request.get(url);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			const ratio = base.width / base.height;
			const width = data.width / 3;
			const height = Math.round(width / ratio);
			ctx.drawImage(base, 0, data.height - height, width, height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.channel.send({ files: [{ attachment, name: 'brazzers.png' }] });
};
module.exports.help = {
  name: "brazzers",
  catégorie: "Images",
  helpcaté: "images",
};
