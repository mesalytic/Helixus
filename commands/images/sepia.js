const jimp = require('jimp');
const Command = require("../../structures/Command");

module.exports = class SepiaCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'sepia',
            usage: 'sepia [url]',
            description: 'Adds a sepia effect to the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.SEPIA.pleaseWait);
        
        jimp.read(url).then(img => {
            img.sepia()
            .getBuffer(jimp.MIME_PNG, (err, res) => {
                m.delete();
                message.channel.send({ files: [{ attachment: new Buffer(res, 'base64'), name: "sepia.png" }] });
            })
        })
    }
}