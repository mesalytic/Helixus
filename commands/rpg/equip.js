const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const allItems = require("../../structures/Items/allItems");
const { getTowerItem } = require("../../structures/Items/items/towerItems/functions");
const { capitalize, objectMessage } = require("../../structures/Utils");

module.exports = class EquipCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'equip',
            description: "Equip items. Equipment worn gives more stats than items used by your army.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message, args) {
        console.log("a");
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        if (args.length === 0) return message.channel.send(this.showEquipment(dbUser));

        const item = args.join(" ");

        this.equipItem(dbUser, item).then((response) => {
            message.channel.send(`${message.author}: ${response}`)
        })
    }

    async equipItem(user, itemName) {
        let item = allItems[itemName] || getTowerItem(itemName);
        if (!item) {
            itemName = Object.values(user.army.armory).map(allItemsCat => {
                return Object.keys(allItemsCat).find(i => i.includes(itemName)) || false;
            }).filter(el => el)[0];

            item = allItems[itemName] || getTowerItem(itemName);
        }

        const canBeEquipped = this.canBeEquipped(user, item, itemName);
        if (!canBeEquipped.response) return canBeEquipped.message;

        const currentItemName = user.armor[item.typeSequence[item.typeSequence.length - 1]];
        const currentItem = allItems[currentItemName] || getTowerItem(currentItemName);

        await user.equipItem(item, currentItem);
        
        return `${item.name} was successfully equipped!`
    }

    canBeEquipped(user, item, itemName) {
        if (!item) return { response: false, message: "This item does not exist." }

        const { armory } = user.army;
        const { name, typeSequence, towerItem } = item;
        const itemType = typeSequence[typeSequence.length - 1];
        console.log(armory);
        const usersItem = Object.keys(armory[itemType]);

        if ((!usersItem.includes(name) && !towerItem) || armory[itemType][name] < 1 || (towerItem && !usersItem.find(it => it.toLowerCase() === itemName))) return { response: false, message: "You do not own this item." }

        return { response: true }
    }

    showEquipment(user) {
        const fields = Object.keys(user.army.armory).filter(el => !el.startsWith("$")).map(itemType => { return this.addEquipmentField(user, itemType) })
        const currentEquipFields = Object.keys(user.armor).filter(el => !el.startsWith("$")).map(itemType => this.addCurrentEquipment(user, itemType));

        if (currentEquipFields.length > 0) {
            const currentEquipHeader = {
                name: "\u200B",
                value: "__**Equipped Items:**__",
            }

            const inventoryItemsHeader = {
                name: "\u200b",
                value: "__**Inventory:**__"
            };

            fields.unshift(currentEquipHeader, ...currentEquipFields, inventoryItemsHeader);
        }

        if (fields.length === 0) {
            fields.push({
                name: "You don't have any equipment in your inventory! If you have an armorer or a blacksmith, you can start crafting some.",
                value: "Build a blacksmith with `am!build blacksmith`, then craft your sword using `am!craft bronze sword.` You'll then be able to equip it using `am!equip bronze sword`."
            })
        }

        if ((fields.length + 2) % 3) {
            fields.push({
                name: "\u200B",
                value: "\u200B",
                inline: true,
            });
        }

        const embed = new MessageEmbed()
            .setTitle(`${user.account.username}'s available equipment`)
            .setColor("RANDOM")
            .addFields(...fields);

        return embed;
    }

    addEquipmentField(user, iType) {
        const items = Object.keys(user.army.armory[iType]).sort((a, b) => this.sortHelper(a) - this.sortHelper(b));

        const value = items.map(item => {
            const itemAmount = user.army.armory[iType][item];
            if (!itemAmount) return false;
            const itemObj = allItems[item] || getTowerItem(item);
            return `[${itemAmount}] ${capitalize(item)}\n${objectMessage(itemObj.stats)}`;
        }).filter(el => el);

        const field = {
            name: `${capitalize(iType)}s`,
            value: value.length > 0 ? value : "[NONE]",
            inline: true
        }

        return field;
    }

    addCurrentEquipment(user, iType) {
        const item = user.armor[iType];

        const itemObj = allItems[item] || getTowerItem(item);
        let value;

        if (itemObj) {
            value = `${capitalize(item)}\n${objectMessage(itemObj.stats)}`;
        }

        const field = {
            name: `${capitalize(iType)}s`,
            value: value ? value : "[NONE]",
            inline: true
        };

        return field;
    }

    sortHelper(a) {
        const item = allItems[a]
    }
}