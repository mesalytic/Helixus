const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class BobRossCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'bobross',
            usage: 'bobross [url]',
            description: 'You are now a Bob Ross art.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png" }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.BOBROSS.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/bobross.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, base.width, base.height);
        ctx.drawImage(avatar, 15, 20, 440, 440);
        ctx.drawImage(base, 0, 0);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "bobross.png" }] });
    }
}