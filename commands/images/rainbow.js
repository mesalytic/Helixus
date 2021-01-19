const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class RainbowCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'rainbow',
            usage: 'rainbow [url]',
            description: 'Adds a Rainbow effect to the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.RAINBOW.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/rainbow.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(avatar, 0, 0);
        ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "rainbow.png" }] });
    }
}