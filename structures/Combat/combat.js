const calculateStats = require("./calculateStats")

const calculatePve = (user, npc) => {
    const { stats } = calculateStats(user);
    const combatModifier = 1 - Math.random() / 3;
    const userHp = stats.currentHealth * combatModifier;
    const userAtk = stats.attack * combatModifier;
    const { health: opponentHp, attack: opponentAtk } = npc.stats;

    const losses = userHp + userAtk - (opponentHp + opponentAtk);
    const win = losses > 0;
    let lossPercent = (userHp + userAtk - (opponentHp + opponentAtk)) / (userHp + userAtk);
    if (lossPercent < 0) lossPercent = 0;

    const damageLost = Math.abs(Math.round(lossPercent * user.currentHealth - user.currentHealth));

    const pveResult = {
        combatModifier,
        expReward: 0,
        levelUp: false,
        demote: false,
        lossPercent,
        resourceReward: {},
        win,
        damageLost
    }

    if (win) {
        pveResult.resourceReward = Object.keys(npc.reward).reduce((acc, cur) => {
            const randomReward = Math.ceil(Math.random() * npc.rewards[cur] / 2);
            acc[cur] = randomReward;
            return acc;
        }, {});
        
        pveResult.expReward = Math.ceil(Math.random() * (npc.stats.attack + npc.stats.health) / 2)
    } else {
        pveResult.expReward = Math.ceil(Math.random() * 5);
        
        if (user.rank > 0 && damageLost + user.currentHealth >= user.health) {
            pveResult.levelUp = false;
            pveResult.expReward = 0;
            pveResult.demote = true;
        }
    }

    if (pveResult.expReward + user.currentExp >= user.expToNextRank) pveResult.levelUp = true;

    return pveResult;
}

const calculatePveFullArmyResult = (user, npc) => {
    const { totalStats } = calculateStats(user);
	const combatModifier = 1 - Math.random() / 2;
	const userHp = totalStats.health * combatModifier;
	const userAtk = totalStats.attack * combatModifier;
	const { health: opponentHp, attack: opponentAtk } = npc.stats;

	const losses = userHp + userAtk - (opponentHp + opponentAtk);
	const win = losses > 0;
	let lossPercent = losses / (userHp + userAtk);
	if(lossPercent < 0) lossPercent = 0;
	const { username, userId } = user.account;
	const damageLost = Math.abs(Math.round(lossPercent * user.currentHealth - user.currentHealth));

    const pveResult = {
        combatModifier,
        expReward: 0,
        levelUp: false,
        demote: false,
        lossPercent,
        resourceReward: {},
        remainingForces: losses > 0 ? 0 : Math.floor(Math.abs(losses)),
        win,
        username,
        userId,
        damageLost
    }

    if (win) {
        if (npc.rewards) {
            pveResult.resourceReward = Object.keys(npc.rewards).reduce((acc, cur) => {
                const randomReward = Math.ceil(Math.random() * npc.rewards[cur] + npc.rewards[cur] / 2);
                acc[cur] = randomReward;

                return acc;
            }, {})
        }

        pveResult.expRewards = Math.ceil((Math.random() * (npc.stats.attack + npc.stats.health)) / 2)
    } else {
        pveResult.expReward = Math.ceil(Math.random() * 10);

        if (user.rank > 0 && damageLost + user.currentHealth >= user.health) {
            pveResult.levelUp = false;
            pveResult.expReward = 0;
            pveResult.demote = true;
        }
    }

    if (pveResult.expReward + user.currentExp >= user.expToNextRank) {
        pveResult.levelUp = true;
    }

    return pveResult;
};

const duelFullArmy = (user, opponent) => {
    const { totalStats: userStats } = calculateStats(user);
    const userModifier = 1 - Math.random() / 2;
    const userHp = userStats.health * userModifier;
    const userAtk = userStats.attack * userModifier;

    const { totalStats: opponentStats } = calculateStats(opponent);
    const opponentModifier = 1 - Math.random() / 2;
    const opponentHp = opponentStats.health * opponentModifier;
    const opponentAtk = opponentStats.attack * opponentModifier;

    const winMargin = Math.floor(userHp - userAtk - (opponentHealth + opponentAtk));

    const win = winMargin > 0;
    return { win, winMargin: Math.abs(winMargin), userModifier, opponentModifier }
}

module.exports = { calculatePveFullArmyResult, calculatePve, duelFullArmy }