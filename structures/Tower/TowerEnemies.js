const levelTen = require("./levels/10");
const levelHundred = require("./levels/100");
const levelTwenty = require("./levels/20");
const levelThirty = require("./levels/30");
const levelForty = require("./levels/40");
const levelFifty = require("./levels/50");
const levelSixty = require("./levels/60");
const levelSeventy = require("./levels/70");
const levelEightly = require("./levels/80");
const levelNinty = require("./levels/90");

const getArmyTowerEnemies = (level) => {
    level = level % 101;

    if (level <= 10) return pickUnitHandler(levelTen, level);
    else if (level >= 11 && level <= 20) return pickUnitHandler(levelTwenty, level);
    else if (level >= 21 && level <= 30) return pickUnitHandler(levelThirty, level);
    else if (level >= 31 && level <= 40) return pickUnitHandler(levelForty, level);
    else if (level >= 41 && level <= 50) return pickUnitHandler(levelFifty, level);
    else if (level >= 51 && level <= 60) return pickUnitHandler(levelSixty, level);
    else if (level >= 61 && level <= 70) return pickUnitHandler(levelSeventy, level);
    else if (level >= 71 && level <= 80) return pickUnitHandler(levelEightly, level);
    else if (level >= 81 && level <= 90) return pickUnitHandler(levelNinty, level);
    else if (level >= 91 && level <= 100) return pickUnitHandler(levelHundred, level);
    else {
        if (level % 10 === 0) return levelTen.boss;
        const randomEnemy = Math.floor(Math.random() * levelTen.units.length);

        return levelTen.units[randomEnemy]
    }
}

const pickUnitHandler = (units, level) => {
    if (level % 10 === 0 && level !== 0) return units.boss;
    const randomEnemy = Math.floor(Math.random() * units.units.length);

    return units.units[randomEnemy];
};

module.exports = { getArmyTowerEnemies };