const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { getIcon, onCooldown } = require("../../structures/Utils");
const { worldLocations } = require('../../structures/Universe/index');
const { fishPrices } = require("../../structures/Constants");

module.exports = class FishCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'fish',
            description: "Fish and gain gold.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id });
        
        const { currentLocation } = dbUser.world;
        const cooldown = onCooldown("fish", dbUser);

        if (cooldown.response) {
            return message.channel.send(cooldown.embed);
        }

        const fishingPlace = Object.values(worldLocations[currentLocation].places).find(p => { return p.type === "fish" });
        const locationIcon = getIcon(currentLocation);
        const placeIcon = getIcon("fish");
        if (!dbUser.world.locations[currentLocation].explored.includes([fishingPlace.name])) {
            return message.channel.send(`X - You haven't found any ${placeIcon} fishing spots yet in ${locationIcon} ${currentLocation}!`)
        }

        const { fish } = fishingPlace;

        const result = this.calculateFishResult(fish);

        const now = new Date();
        dbUser.setNewCooldown("fish", now);
        dbUser.gainManyResources({ gold: result.gold });
        await dbUser.save();

        return message.channel.send(result.response);
    }

    calculateFishResult(fish, chance = (1 / 4)) {
        const result = {
            response: "",
            gold: 0
        }
        const randomNumber = Math.random();

        if (randomNumber < chance) {
            result.response = this.generateFailFishSentence();
            return result;
        }
        const fishCaught = fish[Math.floor(Math.random() * fish.length)];
        result.gold = Math.ceil(Math.random() * (fishPrices[fishCaught] - (fishPrices[fishCaught] / 2)) + (fishPrices[fishCaught] / 2));
        result.response = this.generateSucceedFishSentence(result.gold, fishCaught);
        return result;
    }

    generateFailFishSentence() {
        const sentences = [
            "You fished for hours with no luck",
            "You lost your bait while fishing",
            "You caught an old boot",
            "You put your fishing rod down and took a swim instead",
            "A mermaid spotted you while fishing, distracting you with a suggestive sea shell bikini",
            "You spot a siren in the shoreline. Her songs makes you forget about time and space",
            "After fishing for hours, your rod broke while swinging it",
        ];
        return sentences[Math.floor(Math.random() * sentences.length)];
    };

    generateSucceedFishSentence(gold, fishCaught) {
        const sentences = [
            `You caught a **${fishCaught}** and sold it for **${gold}** gold`,
            `A magical **${fishCaught}** swims to your bait and gazes at you: "Hello adventurer, I have somet---" \n You quickly grab the magic fish and put it in your bucket. You care not about talking fish, only about sweet cash. Gold +**${gold}**!`,
            `A small **${fishCaught}** jumped into your bucket! Gold +**${gold}**`,
            `A strange man approaches you and offer you a **${fishCaught}** for the price of your soul. You gladly accept and sell it back to him for **${gold}** gold`,
            `Your bait is too over powered and within minutes you caught a **${fishCaught}** and sold it for **${gold}** gold`,
            `You decide to change things up and used the fishing rod as a spear with huge success! A **${fishCaught}** was caught and sold for **${gold}** gold`,
            `After many hours of fishing, you catch a **${fishCaught}** and sold it for **${gold}** gold`,
            `As you start fishing, you notice a sick **${fishCaught}** floating in the water. You split it open and find **${gold}** gold coins`,
            `A stream of **${fishCaught}s** swims by and you manage to catch one. You sold it at the local market for **${gold}** gold`,
            `Not even a minute passes by until a **${fishCaught}** is chewing on your bait. A local tradesman bought it for **${gold}** gold`,
        ];
        return sentences[Math.floor(Math.random() * sentences.length)];
    };
}