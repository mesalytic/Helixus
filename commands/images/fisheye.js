const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class FishEyeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'fisheye',
            usage: 'fisheye [url]',
            description: 'Adds a fisheye effect to the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.FISHEYE.pleaseWait);

        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(avatar, 0, 0);
        this.fishEye(ctx, 66, 0, 0, avatar.width, avatar.height)
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "fisheye.png" }] });
    }
    fishEye(ctx, level, x, y, width, height) {
        const frame = ctx.getImageData(x, y, width, height);
        const source = new Uint8Array(frame.data);
        for (let i = 0; i < frame.data.length; i += 4) {
            const sx = (i / 4) % frame.width;
            const sy = Math.floor(i / 4 / frame.width);
            const dx = Math.floor(frame.width / 2) - sx;
            const dy = Math.floor(frame.height / 2) - sy;
            const dist = Math.sqrt((dx * dx) + (dy * dy));
            const x2 = Math.round((frame.width / 2) - (dx * Math.sin(dist / (level * Math.PI) / 2)));
            const y2 = Math.round((frame.height / 2) - (dy * Math.sin(dist / (level * Math.PI) / 2)));
            const i2 = ((y2 * frame.width) + x2) * 4;
            frame.data[i] = source[i2];
            frame.data[i + 1] = source[i2 + 1];
            frame.data[i + 2] = source[i2 + 2];
            frame.data[i + 3] = source[i2 + 3];
        }
        ctx.putImageData(frame, x, y);
        return ctx;
    }
}