const mongoose = require('mongoose');
const allBuilds = require('./allBuilds');
const { statIncreaseOnLevel, expToNextLevel } = require('./Constants');
const { randomInt } = require('./Utils');

const rpgSchema = mongoose.Schema({
    account: {
        username: String,
        userId: String,
        bans: {
            type: Number,
            default: 0
        },
        banTime: Number,
        testUser: {
            type: Boolean,
            default: false,
        },
        premium: {
            type: Boolean,
            default: false,
        },
    },
    maxPop: {
        type: Number,
        default: 10,
    },
    maxBuildings: {
        type: Number,
        default: 9
    },
    cooldowns: {
        duel: {
            type: Date,
            default: 0,
        },
        dailyPrize: {
            type: Date,
            default: 0,
        },
        dungeon: {
            type: Date,
            default: 0,
        },
        explore: {
            type: Date,
            default: 0,
        },
        fish: {
            type: Date,
            default: 0,
        },
        hunt: {
            type: Date,
            default: 0,
        },
        miniboss: {
            type: Date,
            default: 0,
        },
        race: {
            type: Date,
            default: 0,
        },
        raid: {
            type: Date,
            default: 0,
        },
        tower: {
            type: Date,
            default: 0,
        },
        weeklyPrize: {
            type: Date,
            default: 0,
        },
    },
    resources: {
        gold: {
            type: Number,
            default: 100,
        },
        ["oak wood"]: {
            type: Number,
            default: 5,
        },
        ["yew wood"]: {
            type: Number,
            default: 0,
        },
        ["barlind wood"]: {
            type: Number,
            default: 0,
        },
        ["aspen wood"]: {
            type: Number,
            default: 0,
        },
        ["copper ore"]: {
            type: Number,
            default: 10,
        },
        ["iron ore"]: {
            type: Number,
            default: 0,
        },
        ["mithril ore"]: {
            type: Number,
            default: 0,
        },
        ["burite ore"]: {
            type: Number,
            default: 0,
        },
        ["bronze bar"]: {
            type: Number,
            default: 0,
        },
        ["iron bar"]: {
            type: Number,
            default: 0,
        },
        ["steel bar"]: {
            type: Number,
            default: 0,
        },
        ["mithril bar"]: {
            type: Number,
            default: 0,
        },
        ["pyrite bar"]: {
            type: Number,
            default: 0,
        },
        ["obsidian ore"]: {
            type: Number,
            default: 0,
        },
    },

    army: {
        armory: {
            helmet: {
                type: Object,
                default: {},
            },
            chest: {
                type: Object,
                default: {},
            },
            legging: {
                type: Object,
                default: {},
            },
            weapon: {
                type: Object,
                default: {},
            },
        },
        units: {
            archery: {
                huntsman: {
                    type: Number,
                    default: 0,
                },
                archer: {
                    type: Number,
                    default: 0,
                },
                ranger: {
                    type: Number,
                    default: 0,
                },
                survivalist: {
                    type: Number,
                    default: 0,
                },
                sharpshooter: {
                    type: Number,
                    default: 0,
                },
            },
            barracks: {
                peasant: {
                    type: Number,
                    default: 5,
                },
                militia: {
                    type: Number,
                    default: 0,
                },
                guardsman: {
                    type: Number,
                    default: 0,
                },
                knight: {
                    type: Number,
                    default: 0,
                },
                berserker: {
                    type: Number,
                    default: 0,
                },
                justicar: {
                    type: Number,
                    default: 0,
                },
            },
        },
    },

    world: {
        currentLocation: {
            type: String,
            default: "Grassy Plains",
        },

        locations: {
            "Grassy Plains": {
                available: {
                    type: Boolean,
                    default: true,
                },
                explored: [String],
            },
            "Misty Mountains": {
                available: {
                    type: Boolean,
                    default: false,
                },
                explored: [String],
            },
            "Deep Caves": {
                available: {
                    type: Boolean,
                    default: false,
                },
                explored: [String],
            },
        },
    },

    empire: {
        type: Array,
        default: [],
    },
    elo: {
        type: Number,
        default: 1200,
    },
    health: {
        type: Number,
        default: 100,
    },
    currentHealth: {
        type: Number,
        default: 100,
    },
    attack: {
        type: Number,
        default: 5,
    },
    defense: {
        type: Number,
        default: 3,
    },
    inventory: {
        ["Small Healing Potion"]: {
            type: Number,
            default: 5,
        },
        ["Large Healing Potion"]: {
            type: Number,
            default: 0,
        },
        ["Enourmous Healing Potion"]: {
            type: Number,
            default: 0,
        },
        ["Quality Healing Potion"]: {
            type: Number,
            default: 0,
        },
        ["Mega Healing Potion"]: {
            type: Number,
            default: 0,
        },
        ["Ultra Healing Potion"]: {
            type: Number,
            default: 0,
        },
        ["Small Healing Salve"]: {
            type: Number,
            default: 0,
        },
        ["Large Healing Salve"]: {
            type: Number,
            default: 0,
        },
    },
    dungeonKeys: {
        "CM Key": {
            type: Number,
            default: 0,
        },
        "Eridian Vase": {
            type: Number,
            default: 0
        },
        "The One Shell": {
            type: Number,
            default: 0
        }
    },
    currentExp: {
        type: Number,
        default: 1,
    },
    expToNextRank: {
        type: Number,
        default: 100,
    },
    rank: {
        type: Number,
        default: 0,
    },
    armor: {
        helmet: {
            type: String,
            default: "[NONE]",
        },
        chest: {
            type: String,
            default: "[NONE]",
        },
        legging: {
            type: String,
            default: "[NONE]",
        },
        weapon: {
            type: String,
            default: "[NONE]",
        },
    },
    consecutivePrizes: {
        dailyPrize: {
            type: Number,
            default: 0,
        },
        weeklyPrize: {
            type: Number,
            default: 0,
        },
    },
    // Array of Objects.
    // quests: [{started: Bolean, questKeySequence: Array, name: String}]
    quests: {
        type: [
            {
                type: Object,
            },
        ],
        default: [{
            started: false,
            questKeySequence: ["gettingStarted", "buildMine"],
            name: "Build a Mine",
            // pve: [{ // Raid is optional
            // 	name: String, // e.g: "Collapsed Mine"
            //	completed: Bolean,
            // chance: Number, // e.g. 0.5 chance to get it (50%)
            // },]
        }],
    },
    completedQuests: [String],
    // Saving the rooms etc, of the towers
    tower: {
        "solo full-army": {
            level: {
                type: Number,
                default: 1,
            }
        },
        "trio full-army": {
            level: {
                type: Number,
                default: 1,
            },
            users: {
                type: Array,
                default: [],
            }
        },
        "solo": {
            level: {
                type: Number,
                default: 1,
            },
        },
        "trio": {
            level: {
                type: Number,
                default: 1,
            },
            users: {
                type: Array,
                default: [],
            }
        }
    },

    // object too big, moved to ./uservalues/default
    statistics: {
        army: {
            type: Number,
            default: 0,
        },
        build: {
            type: Number,
            default: 0,
        },
        buy: {
            type: Number,
            default: 0,
        },
        collect: {
            type: Number,
            default: 0,
        },
        cooldown: {
            type: Number,
            default: 0,
        },
        craft: {
            type: Number,
            default: 0,
        },
        dailyprize: {
            type: Number,
            default: 0,
        },
        duel: {
            type: Number,
            default: 0,
        },
        dungeon: {
            type: Number,
            default: 0,
        },
        equip: {
            type: Number,
            default: 0,
        },
        explore: {
            type: Number,
            default: 0,
        },
        fish: {
            type: Number,
            default: 0,
        },
        grid: {
            type: Number,
            default: 0,
        },
        help: {
            type: Number,
            default: 0,
        },
        hunt: {
            type: Number,
            default: 0,
        },
        info: {
            type: Number,
            default: 0,
        },
        look: {
            type: Number,
            default: 0,
        },
        miniboss: {
            type: Number,
            default: 0,
        },
        produce: {
            type: Number,
            default: 0,
        },
        profile: {
            type: Number,
            default: 0,
        },
        quest: {
            type: Number,
            default: 0,
        },
        race: {
            type: Number,
            default: 0,
        },
        raid: {
            type: Number,
            default: 0,
        },
        rank: {
            type: Number,
            default: 0,
        },
        recruit: {
            type: Number,
            default: 0,
        },
        resources: {
            type: Number,
            default: 0,
        },
        stake: {
            type: Number,
            default: 0,
        },
        tower: {
            type: Number,
            default: 0,
        },
        travel: {
            type: Number,
            default: 0,
        },
        use: {
            type: Number,
            default: 0,
        },
        weeklyprize: {
            type: Number,
            default: 0,
        },
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});

rpgSchema.methods.setNewCooldown = function(type, now) {
    this.cooldowns[type] = now;
}

rpgSchema.methods.handleExplore = function(currentLoc, place) {
    if (!this.world.locations[currentLoc].explored.includes(place)) {
        this.world.locations[currentLoc].explored.push(place);
        this.markModified(this.world.locations[currentLoc].explored);
    }
}

rpgSchema.methods.gainManyResources = function(obj) {
    Object.keys(obj).forEach(r => {
        this.resources[r] += obj[r];
    })
}

rpgSchema.methods.startQuest = async function(questName) {
    const foundIndex = this.quests.indexOf(this.quests.find(q => {
        return q.name === questName;
    }))
    this.quests[foundIndex].started = true;
    this.markModified(`quests.${foundIndex}.started`);
}

rpgSchema.methods.addNewQuest = async function(quest) {
    this.quests.push(quest);
}

rpgSchema.methods.removeQuest = async function(questName) {
    const questIndex = this.quests.indexOf(this.quests.find(q => q.name === questName));
    this.quests.splice(questIndex, 1);
    this.completedQuests.push(questName);

    return;
}

rpgSchema.methods.addItem = function(item, amount = 1, craft) {
    if (craft) {
        for (const resource in item.cost) {
            this.resources[resource] -= item.cost[resource] * amount;
        }
    }

    let itemType;
    let markModifiedString = "";
    item.typeSequence.forEach(type => {
        itemType = itemType ? itemType[type] : this[type];
        markModifiedString += type + ".";
    });

    itemType[item.name] = typeof itemType[item.name] === "number" ?
        itemType[item.name] + amount : amount;

    this.markModified(`${markModifiedString}${item.name}`);
}

rpgSchema.methods.removeItem = function (item, user, amount = 1) {
    const itemType = item.typeSequence[item.typeSequence.length - 1];

    if (user) {
        this.armor[itemType] = "[NONE]";
        this.markModified("armor");
    } else {
        this.army.armory[itemType][item.name] -= amount;
        this.markModified(`army.armory.${itemType}.${item.name}`);
    }
}

rpgSchema.methods.addOrRemoveUnits = function(unit, amount, free) {
    if (!free) {
        for (const resource of unit.cost) {
            this.resources[resource] -= unit.cost[resource] * amount;
        }
    }

    this.army.units[unit.requirement.building][unit.name] += amount;
    //this.markModified ???
}

rpgSchema.methods.updateHousePop = function(newPop) {
    this.maxPop = newPop;
    return this.save();
}

rpgSchema.methods.updateNewProduction = function(productionName, now, producing) {
    const foundIndex = this.empire.findIndex(building => building.name === productionName && !building.lastCollected);
    if (foundIndex === -1) return;

    this.empire[foundIndex].lastCollected = now;

    if (!this.empire[foundIndex].producing) this.empire[foundIndex].producing = producing;

    this.markModified(`empire.${foundIndex}.lastCollected`);
    this.markModified(`empire.${foundIndex}.producing`);
    
    return this.save();
}

rpgSchema.methods.updateMaxBuildings = function() {
    const senate = this.empire.find(building => building.name === "senate");

    this.maxBuildings = 9 + senate.level + 1;
}

rpgSchema.methods.buyBuilding = function(building, buildCost) {
    for (const resource in buildCost.cost) {
        this.resources[resource] -= buildCost.cost[resource];
    }

    this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
    this.empire.push(building);
    return this.save();
}

rpgSchema.methods.collectResource = async function (collectBuildings, now, resource) {
    const totalCollected = {};

    collectBuildings.forEach(collect => {
        this.empire.forEach((build, i) => {
            if (build.name === collect) {
                const { producing, lastCollected:lastCol, level, name } = build;

                const lastCollected = (now - lastCol) / 60000;
                let produced = Math.floor(lastCollected * allBuilds[name].levels.find(b => b.level === level).productionRate);

                if (!produced && !resource) return totalCollected[producing] = totalCollected[producing] ? totalCollected[producing] + produced : produced;
                if (produced > 100 + build.level * 10) produced = 100 + build.level * 10;

                this.resources[producing] = this.resources[producing] ? this.resources[producing] + produced : produced;
                totalCollected[producing] = totalCollected[producing] ? totalCollected[producing] + produced : produced;
                build.lastCollected = now;

                this.markModified(`empire.${i}.lastCollected`);

                if (resource) {
                    build.producing = resource;
                    this.markModified(`empire.${i}.producing`)
                }
            }
        })
    })

    await this.save();
    return totalCollected;
}

rpgSchema.methods.buyItem = async function(item, amount = 1) {
    if (item.price) this.resources.gold -= item.price * amount;

    if (!this.inventory[item.name]) this.inventory[item.name] = amount;
    else this.inventory[item.name] += amount;

    this.markModified("inventory");
}

rpgSchema.methods.unitLoss = function(lossPercent, towerFight) {
    Object.values(this.army.units).forEach(unitBuilding => {
        Object.keys(unitBuilding).forEach(unit => {
            if (typeof unitBuilding[unit] === "number") {
                unitBuilding[unit] = Math.floor(unitBuilding[unit] * lossPercent);
                this.markModified(`army.units.${unitBuilding}.${unit}`);
            }
        })
    })

    this.currentHealth = Math.floor(this.currentHealth * lossPercent);

    if (this.currentHealth <= 0 && this.rank > 0 && !towerFight) {
        Object.keys(statIncreaseOnLevel[this.rank]).forEach(s => {
            this[s] -= statIncreaseOnLevel[this.rank][s];
        })
        this.rank -= 1;
        this.expToNextRank = expToNextLevel[this.rank];
        this.currentExp = expToNextLevel[this.rank - 1] ? getNewCurrentExpAfterDeath(expToNextLevel[this.rank - 1], expToNextLevel[this.rank - 1]) : 50;
    }
}

rpgSchema.methods.alternativeGainXp = async function(xp = 0) {
    if (xp) this.currentExp += xp;
    if (this.currentExp >= this.expToNextRank) {
        if (expToNextLevel.length > this.rank + 1) {
            this.rank += 1;
            this.expToNextRank = expToNextLevel[this.rank];
            Object.keys(statIncreaseOnLevel[this.rank]).forEach(s => {
                this[s] += statIncreaseOnLevel[this.rank][s];
            })    
        }
    }
}

rpgSchema.methods.changeTowerLevel = function(towerCategory, newLevel) {
    if (typeof newLevel !== "number") {
        console.error(`newLevel is not a number but ${typeof newLevel}`);
        return;
    }
    this.tower[towerCategory].level = newLevel;
}

rpgSchema.methods.equipItem = function (item, currentItem) {
    const equipmentBonus = 2;
    const itemType = item.typeSequence[item.typeSequence.length - 1];

    this.army.armory[itemType][item.name] -= 1;
    this.armor[itemType] = item.name;

    if (currentItem) {
        if (!this.army.armory[itemType][currentItem.name]) this.army.armory[itemType][currentItem.name] = 0;
        this.army.armory[itemType][currentItem.name] += 1;

        for (const stat in currentItem.stats) this[stat] -= currentItem.stats[stat] * equipmentBonus;
    }

    for (const stat in item.stats) this[stat] += item.stats[stat] * equipmentBonus;

    this.markModified(`army.armory.${itemType}`);
    this.markModified(`armor.${itemType}`);

    return this.save();
}

rpgSchema.methods.destroyBuilding = function(building) {
    this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
};

const getNewCurrentExpAfterDeath = (oneLevelDown, currentLevel) => {
    const difference = currentLevel - oneLevelDown;
    const result = randomInt(oneLevelDown + (difference / 2), currentLevel - (difference / 3));
    return result;
}

const rpg = mongoose.model('rpgPlayer', rpgSchema);
module.exports.Rpg = rpg;