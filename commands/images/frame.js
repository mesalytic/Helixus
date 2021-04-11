const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class FrameCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'frame',
            usage: 'frame [url]',
            description: 'Adds a frame in the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.FRAME.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/frame.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(avatar, 0, 0);
        ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "frame.png" }] });
    }
}