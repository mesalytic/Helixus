const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const { getIcon, capitalize, getPlayerPosition } = require("../../structures/Utils");
const allUnits = require("../../structures/Units/allUnits");
module.exports = class ProfileCommand extends Command {
    constructor(bot) {
            super(bot, {
                name: 'profile',
                description: "Displays RPG user profile.",
                type: 'rpg'
            });
        }
        /**
         * @param {Message} message
         */
    async run(message) {
        let mentionned;
        let dbUser;
        let avatar;

        if (message.mentions.users.first()) mentionned = message.mentions.users.first()
        else mentionned = message.author;

        try {
            dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": mentionned.id })
            avatar = mentionned.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
        } catch (err) {
            throw err;
        }

        const armyStats = this.calculateStats(dbUser);

        const fields = [
            { name: `Stats`, value: `❤️ HP: ${dbUser.currentHealth}/${dbUser.health}\n⚔ AT: ${dbUser.attack}\n🛡 DEF: ${dbUser.defense}\n🔅 XP: ${dbUser.currentExp}/${dbUser.expToNextRank}`, inline: true },
            { name: "Equipment", value: `🧢 Helmet: ${capitalize(dbUser.armor.helmet)}\n⚜️ Chest: ${capitalize(dbUser.armor.chest)}\n🦵 Leggings: ${capitalize(dbUser.armor.legging)}\n🗡 Weapon: ${capitalize(dbUser.armor.weapon)}`, inline: true },
            { name: "Army", value: `👮‍♀️ Soldiers: ${this.getAllSoldiers(dbUser.army.units)}\n⚔ AT: ${armyStats.unitStats.attack}\n❤️ HP: ${armyStats.unitStats.health}`, inline: true },
            { name: "Inventory", value: `💰 Gold: ${dbUser.resources.gold}\n${Object.keys(dbUser.inventory).map(item => typeof dbUser.inventory[item] === "number" ? this.addInventoryValueToProfile(item, dbUser) : false).filter(i => i).join(" ")}`, inline: true }
        ]

        const keys = {
            name: "Keys",
            value: [],
            inline: true
        }
        Object.keys(dbUser.dungeonKeys).forEach(key => {
            if (dbUser.dungeonKeys[key] && !key.startsWith("$")) {
                keys.value.push(`${getIcon(key)} ${key}\n`)
            }
        })
        if (keys.value.length) {
            fields.splice(2, 0, keys);
        }

        let elo = await getPlayerPosition(message.author.id, "elo", message.client)

        const embed = new MessageEmbed()
            .setDescription(`Elo: ${dbUser.elo || 1200}`)
            .setAuthor(`(${elo}) ${dbUser.account.username}'s profile`)
            .addFields(...fields);
        if (avatar) embed.setThumbnail(avatar);

        message.channel.send(embed);
    }

    calculateStats(user) {
        const { units, armory } = user.army;

        const totalStats = {};
        const unitStats = {};
        const stats = {};
        let totalUnits = 0;

        Object.values(units).forEach(unitType => {
            Object.keys(unitType).forEach(unit => {

                if (!unit.startsWith("$")) {
                    const { stats } = allUnits[unit];
                    for (const stat in stats) {
                        unitStats[stat] = unitStats[stat] && unitStats[stat] !== 0 ? (unitStats[stat] + stats[stat] * unitType[unit]) : stats[stat] * unitType[unit];
                    }
                    totalUnits += unitType[unit];
                }
            });
        });

        if (armory) {
            for (const slot in armory.toJSON()) {
                let slotsTaken = 0;
                const allSlotItems = Object.keys(armory[slot]).map(item => allItems[item] || getTowerItem(item));

                const sortHelper = (a) => {
                    return Object.values(a.stats).reduce((acc, cur) => acc + cur);
                };

                allSlotItems.sort((a, b) => sortHelper(b) - sortHelper(a));

                allSlotItems.forEach((item) => {
                    if (slotsTaken >= totalUnits) return false;

                    const iQuantity = armory[slot][item.name];
                    const iToAdd = totalUnits - slotsTaken - iQuantity;
                    const itemAdded = iToAdd < 0 ? totalUnits - slotsTaken : iQuantity;

                    for (const stat in item.stats) {
                        unitStats[stat] += item.stats[stat] * itemAdded;
                    }

                    slotsTaken += itemAdded;
                });
            }
        }

        const { currentHealth, health, attack } = user;

        stats["health"] = stats["health"] ? stats["health"] + health : health;
        stats["currentHealth"] = stats["currentHealth"] ? stats["currentHealth"] + currentHealth : currentHealth;
        stats["attack"] = Math.floor((stats["attack"] ? stats["attack"] + attack : attack) * (currentHealth / health));

        totalStats["health"] = unitStats["health"] + stats["currentHealth"];
        totalStats["attack"] = unitStats["attack"] + stats["attack"];

        return {
            totalStats,
            unitStats,
            stats,
        };
    }

    addInventoryValueToProfile = (item, user) => {
        return user.inventory[item] ? `${getIcon(item)} ${item}: ${user.inventory[item]}\n\n` : "";
    };

    getAllSoldiers = (units) => {
        let result = 0;
        Object.keys(units).forEach(b => {
            Object.values(units[b]).forEach(n => {
                if (typeof n === "number") {
                    result += n;
                }
            });
        });
        return result;
    };


}