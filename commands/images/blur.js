const jimp = require('jimp');
const Command = require("../../structures/Command");

module.exports = class BlurCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'blur',
            usage: 'blur [url]',
            description: 'Blurs the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.BLUR.pleaseWait);
        
        jimp.read(url).then(img => {
            img.resize(256, 256)
            .blur(4)
            .getBuffer(jimp.MIME_PNG, (err, res) => {
                m.delete();
                message.channel.send({ files: [{ attachment: new Buffer(res, 'base64'), name: "blur.png" }] });
            })
        })        
    }
}