const allUnits = require('../Units/allUnits')
const allItems = require('../Items/allItems');
const { getTowerItem } = require('../Items/items/towerItems/functions');

const calculateStats = (user) => {
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
        })
    })

    if (armory) {
        for (const slot in armory.toJSON()) {
            let slotsTaken = 0;
            const allSlotsItem = Object.keys(armory[slot]).map(item => allItems[item] || getTowerItem(item));

            const sortHelper = (a) => {
                return Object.values(a.stats).reduce((acc, cur) => acc + cur);
            }

            allSlotsItem.sort((a, b) => sortHelper(b) - sortHelper(a));
            allSlotsItem.forEach((item) => {
                if (slotsTaken >= totalUnits) return false;

                const itemQuantity = armory[slot][item.name];
                const itemToAdd = totalUnits - slotsTaken - itemQuantity;
                const itemAdded = itemToAdd < 0 ? totalUnits - slotsTaken : itemQuantity;
                
                for (const stat in item.stats) unitStats[stat] += item.stats[stat] * itemAdded;

                slotsTaken += itemAdded;
            })
        }
    }

    const { currentHealth, health, attack } = user;

    stats["health"] = stats["health"] ? stats["health"] + health : health;
	stats["currentHealth"] = stats["currentHealth"] ? stats["currentHealth"] + currentHealth : currentHealth;
	stats["attack"] = Math.floor((stats["attack"] ? stats["attack"] + attack : attack) * (currentHealth / health));

	// Add Total Stats
	totalStats["health"] = unitStats["health"] + stats["currentHealth"];
	totalStats["attack"] = unitStats["attack"] + stats["attack"];

	return {
		totalStats,
		unitStats,
		stats,
	};
}

module.exports = calculateStats;