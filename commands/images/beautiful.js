const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class BeautifulCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'beautiful',
            usage: 'beautiful [url]',
            description: 'Add\'s your (or someone elses) profile pic to the Pokemon Meme `It\'s been 3000 years...`',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png" }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.BEAUTIFUL.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/plate_beautiful.png`);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, base.width, base.height);
        ctx.drawImage(avatar, 249, 24, 105, 105);
        ctx.drawImage(avatar, 249, 223, 105, 105);
        ctx.drawImage(base, 0, 0);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "beautiful.png" }] });
    }
}