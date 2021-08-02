const quests = require('./quests');

const checkBuildQuests = async (user, building) => {
    const quest = Object.values(quests["Building Quests"]).find(q => q.requirement && q.requirement.building === building.name && q.requirement.level === building.level && !user.completedQuests.includes(q.name) && !user.quests.find(startedQuests => startedQuests.name === q.name));
    if (!quest) return false;

    const newQ = {
        name: quest.name,
        started: false,
        questKeySequence: quest.questKeySequence,
        pve: quest.pve
    };

    user.addNewQuest(newQ);
    await user.save();

    return quest.intro;
}

module.exports = { checkBuildQuests }