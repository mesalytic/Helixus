const Command = require("../../structures/Command");
const { Message, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');

module.exports = class GridCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'grid',
            description: "Displays the building grid and your empire.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })
        
        const gridImage = await this.grid(dbUser);
        await dbUser.save();
        return message.channel.send(`${message.author}'s Empire (${dbUser.empire.length}/${dbUser.empire.length}):`, gridImage);
    }

    async grid(user) {
        const canvas = createCanvas(700, 700);
        const ctx = canvas.getContext('2d');
        
        const gridSize = Math.ceil(Math.sqrt(user.maxBuildings));
        let bg;
        try {
            const bgURL = `./assets/images/grids/grid-${gridSize}x${gridSize}.jpg`;
            if (fs.existsSync(bgURL)) bg = await loadImage(bgURL);
            else bg = await loadImage(`./assets/images/grids/grid-3x3.jpg`);
        } catch (err) {
            throw err;
        }

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const buildingImages = user.empire.map(building => {
            const { name, level } = building;
            return new Promise((resolve) => {
                try {
                    const imgURL = `./assets/images/grids/${name.replace(" ", "-")}-level-${level}.png`;

                    if (fs.existsSync(imgURL)) return resolve(loadImage(imgURL))
                    else return resolve(loadImage("./assets/images/grids/no-image.png"))
                } catch (err) {
                    throw err;
                }
            })
        })

        const images = await Promise.all(buildingImages);

        for (let i = 0; i < images.length; i++) {
            const { width } = canvas;
            const { name, level, position } = user.empire[i];
            ctx.drawImage(
                images[i],
                (width * 0.02 + ((width / gridSize) * position[0])),
                (width * 0.05 + ((width / gridSize) * position[1])),
                (width / gridSize) - 20,
                (width / (gridSize + gridSize / 6)) - 20,
            );

            ctx.font = "24px sans-serif";
            ctx.fillStyle = "#000000";

            ctx.fillText(
                `${name[0].toUpperCase() + name.slice(1)}(${level})`,
                (((width / 6) - (name.length + 3) * 2 * gridSize) + ((width / gridSize) * position[0])),
                (width * 0.04 + ((width / gridSize) * position[1]))
            );
        }
        const attachment = new MessageAttachment(canvas.toBuffer());

        return attachment;
    }
}