const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class BrazzersCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'brazzers',
            usage: 'brazzers [url]',
            description: 'You are now in a Brazzers movie.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.BRAZZERS.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/brazzers.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');

        const ratio = base.width / base.height;
        const width = avatar.width / 3
        const height = Math.round(width / ratio);

        ctx.drawImage(avatar, 0, 0);
        ctx.drawImage(base, 0, avatar.height - height, width, height);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "brazzers.png" }] });
    }
}