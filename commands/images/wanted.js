const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class WantedCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'wanted',
            usage: 'wanted [url]',
            description: 'Adds the Wanted frame from One Piece to the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.WANTED.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/wanted.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(base, 0, 0);
        ctx.drawImage(avatar, 150, 360, 430, 430);
        this.sepia(ctx, 150, 360, 430, 430);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "wanted.png" }] });
    }
    sepia(ctx, x, y, width, height) {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
            data.data[i] = brightness + 100;
            data.data[i + 1] = brightness + 50;
            data.data[i + 2] = brightness;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }
}