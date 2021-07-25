const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const { getIcon } = require("../../structures/Utils");
const { worldLocations } = require('../../structures/Constants')

module.exports = class LookCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'look',
            description: "look",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id });

        const { currentLocation } = dbUser.world;
        const iconLocation = `${getIcon(currentLocation)} ${currentLocation}`;

        const exploredPlaces = dbUser.world.locations[currentLocation].explored;
        const strengths = this.calculateStrengths(currentLocation);
        const expPlacesIcons = exploredPlaces.length ? exploredPLaces.map(place => {
            const { type, stats } = worldLocations[currentLocation].places[place];
            let diff = "";
            if (strengths[type]) {
                const { lowStrength, highStrength } = strengths[type];
                diff = stats ? Math.floor(((Object.values(stats).reduce((a, b) => a + b) - lowStrength) / (highStrength - lowStrength)) * 9 + 1) : "";
            }

            return `${getIcon(type)} ${place} ${typeof diff === "number" ? ":skull_crossbones:".repeat(diff) : diff}`;
        }) : "You have not explored anything here! Start exploring by using `am!explore`!"
        
        const legend = new Set();

        Object.keys(worldLocations[currentLocation].places).map(p => {
            console.log(p);
            legend.add(`${getIcon(p, "icon")} \`am!${p}\`\n`)
        });
        const legendCollection = Array.from(legend).join("");
        const fields = [
            {
                name: "Current Location",
                value: iconLocation,
                inline: false
            },
            { name: "\u200B", value: "\u200B" },
            {
                name: `Explored Places in ${currentLocation}`,
                value: expPlacesIcons,
                inline: false
            },
            {
                name: "Legend",
                value: legendCollection
            }
        ]

        const availableLocations = Object.keys(dbUser.world.locations)
            .filter(i => dbUser.world.locations[i].available === true && i !== currentLocation)
            .map(i => `${getIcon(i)} ${i}`);

        if (availableLocations.length) {
            fields.splice(1, 0, {
                name: "Available Locations",
                value: availableLocations,
                inline: false
            })
        }

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s world`)
            .setColor("RANDOM")
            .addFields(...fields)

        await dbUser.save();
        message.channel.send(embed);
    }

    calculateStrengths(location) {
        const result = {};

        ["raid", "hunt"].forEach((type) => {
            let highStrength, lowStrength;
            Object.values(worldLocations[location].places).filter(loc => loc.type === type).forEach(loc => {
                if (!loc.stats) return;

                const strength = Object.values(loc.stats).reduce((a, b) => a + b);

                if (!highStrength || strength > highStrength) highStrength = strength;
			    if (!lowStrength || strength < lowStrength) lowStrength = strength;
            })

            result[type] = { lowStrength, highStrength };
        });

        return result;
    }
}