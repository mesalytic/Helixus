const quests = require('./quests');

const questHandler = async(user, questName) => {
    if (user.quests.length === 0) return "You currently have no available quests. You may get new ones when you explore new areas or obtain specific items or building levels";

    if (user.quests.length === 1) {
        return await handleExecuteQuest(user, user.quests[0]);
    }

    if (!questName) return showAvailableQuests(user);

    let quest;
    if (isNaN(questName) && isNaN(questName[0])) {
        quest = user.quests.find(q => q.name.toLowerCase() === questName);
    } else {
        quest = user.quests[parseInt(questName.split(" ")[0])]
    }

    if (!quest) return showUnableToFindQuest(user, questName);
    return await handleExecuteQuest(user, quest, questName.split(" ").slice(1));
}

const handleExecuteQuest = async(user, userQuest, choice) => {
    let quest;
    console.log(quests);
    userQuest.questKeySequence.forEach(questKey => {

        quest = quest ? quest[questKey] : quests[questKey]
    })

    const questRes = await quest.execute(user, choice);

    if (!questRes) return showQuestDescription(user, quest, userQuest);
    else return showQuestRewards(user, quest, userQuest);
}

const showQuestDescription = (user, quest, userQuest) => {
    let msg = "";
    if (quest.author) msg += `*Quest Author: ${quest.author}*`;
    msg += `\n**__${quest.name}:__**\n${replaceHandler(user, userQuest, quest.description)}`;
    if (quest.objective) msg += `\n\n__Objective:__\n${replaceHandler(user, userQuest, quest.objective)}`;
    if (quest.reward) msg += `\n\n__Rewards__:\n${quest.reward}`;
    return msg;
}

const replaceHandler = (user, userQuest, questText) => {
    return questText.replace(/%username%/g, user.account.username).replace(/%questIndex%/g, user.quests.indexOf(userQuest));
}

const showQuestRewards = (user, quest) => {
    let msg = `Congratulations you have completed **__${quest.name}__**!`;
    if (quest.winDescription) msg += ` \n\n${quest.winDescription.replace(/%username%/g, user.account.username)}`;
    if (quest.reward) msg += `\n\n__Rewards:__\n${quest.reward}`;

    return msg;
}

const showAvailableQuests = (user) => {
    let msg = `You have ${user.quests.length} quests available:\n`;
    user.quests.forEach((q, i) => {
        msg += `${i}: ${q.name} ${q.started ? "" : "*(new quest!)*"}\n`;
    });

    msg += `\nChoose what quest you want to show: \ne.g. \`am!quest ${user.quests[0].name.toLowerCase()}\` or use the index \`am!quest 0\`)`;
    return msg;
}

const showUnableToFindQuest = (user, questName) => {
    let msg = "\nYou have no quests ";

    if (isNaN(questName)) {
        msg += `named ${questName}. Check that your spelling is correct.\n\n`;
    } else {
        msg += `with index ${questName}. Remember that the first index is **0** and not 1.\n\n`
    }

    msg += showAvailableQuests(user);
    return msg;
}

module.exports = questHandler;