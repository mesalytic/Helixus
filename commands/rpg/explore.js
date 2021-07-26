const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { getIcon, onCooldown, objectFilter } = require("../../structures/Utils");
const { worldLocations } = require('../../structures/Universe/index');

module.exports = class ExploreCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'explore',
            description: "Explore the surroundings of the current location.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id });

        const cooldown = onCooldown("explore", dbUser);
        console.log(onCooldown("explore", dbUser));
        if (cooldown.response) return message.channel.send(cooldown.embed);

        const { currentLocation } = dbUser.world;
        const now = new Date()
        const { places } = worldLocations[currentLocation];
        const explorablePlaces = objectFilter(places, place => !place.notExplorable);

        message.channel.send(await this.exploreArea(dbUser, explorablePlaces, currentLocation, now));
    }

    async exploreArea(user, places, currentLoc, now) {
        user.setNewCooldown("explore", now);
        const placeNames = Object.keys(places);
        let newlyExplored = placeNames[Math.floor(Math.random() * placeNames.length)];
        const previouslyExplored = user.world.locations[currentLoc].explored;
        if (previouslyExplored.length === 0 && currentLoc === "Grassy Plains") {
            newlyExplored = "River";
        }
        let msg;

        if (0.73 > Math.random() || previouslyExplored.includes(newlyExplored)) {
            msg = "After a long adventure, you came back exploring nothing new";
        } else {
            console.log(newlyExplored);
            const wLoc = worldLocations[currentLoc].places[newlyExplored];

            console.log(wLoc);
            let placeIcon = getIcon(currentLoc)
            user.handleExplore(currentLoc, newlyExplored);
            msg = `You went onto a new path and found a ${placeIcon} **${newlyExplored}**`
        }
        await user.save();
        return msg;
    }
}