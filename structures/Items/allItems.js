const blackSmith = require('./items/blacksmithItems');
const artifactBlacksmith = require('./items/artifactBlacksmith');
const forge = require('./items/forgeItems');
const quest = require('./items/questItems')
const tower = require('./items/towerItems/towerItems');

module.exports = { ...blackSmith, ...artifactBlacksmith, ...forge, ...quest, ...tower }