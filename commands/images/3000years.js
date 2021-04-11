const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class ThreeKYearsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: '3000years',
            usage: '3000years [url]',
            description: 'Add\'s your (or someone elses) profile pic to the Pokemon Meme `It\'s been 3000 years...`',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png" }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.THREEKYEARS.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/3000-years.png`);
        const { body } = await request.get(url);
        const data = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(base, 0, 0);
        ctx.drawImage(data, 461, 127, 200, 200);
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "3000years.png" }] });
    }
}