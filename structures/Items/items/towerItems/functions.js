const { getPrefixMultiplier, getPrefix, getRandomPrefix } = require("./prefix");
const towerItems = require("./towerItems");

const getNewTowerItem = (level) => {
    const prefix = getRandomPrefix();
    const towerItemsValue = Object.values(towerItems);
    const randomItemNumber = Math.floor(Math.random() * towerItemsValue.length);

    return `${towerItemsValue[randomItemNumber].name} ${prefix} (${typeof level === "number" ? level : 1 })`;
}

const getTowerItem = (itemName) => {
    const regex = /(?<item>.+?)\s(?<prefix>of\s.+?)\s\((?<level>\d+)\)/g;
    const regexMatch = regex.exec(itemName);
    
    if (!regexMatch) return false;

    const itemMatch = regexMatch.groups;

    const originalTowerItem = Object.values(towerItems).find(i => i.name.toLowerCase() === itemMatch.item.toLowerCase());
    if (!originalTowerItem) return false;

    const item = { ...originalTowerItem, stats: { ...originalTowerItem.stats } };
    item.name = `${item.name} ${getPrefix(itemMatch.prefix)} (${itemMatch.level})`;

    for (const stat in item.stats) {
        item.stats[stat] = Math.floor(item.stats[stat] * getPrefixMultiplier(itemMatch.prefix) * (0.5 + itemMatch.level / 5));
    }

    return item;
}

const removeTowerItem = (user, itemName) => {
    const item = typeof itemName === "string" ? getTowerItem(itemName) : itemName;
    const { typeSequence, stats } = item;

    let itemNameMatch;
    try {
        const regex = /(?<item>.+?)\sof\s/g;
        const regexMatch = regex.exec(item.name);
        itemNameMatch = regexMatch.groups.item;
    } catch {
        console.error("Something went wrong with the regex matching of tower item", item);
        return false;
    }

    const userItems = typeSequence.reduce((acc, cur) => acc[cur], user);
    const userItem = Object.keys(userItems).find(i => i.includes(itemNameMatch) && userItems[i] > 0);

    if (userItem && Object.values(getTowerItem(userItem).stats)[0] < Object.values(stats)[0]) {
        user.removeItem(getTowerItem(userItem));
        return true;
    } else return !userItem;
}

const isTowerItem = (itemName) => {
    const regex = /.+.\sof\s.+?\(\d+\)/;
    return regex.test(itemName);
}

module.exports = { getNewTowerItem, getTowerItem, removeTowerItem, isTowerItem }