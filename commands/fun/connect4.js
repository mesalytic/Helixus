const blankEmoji = '⚪';
const colors = {
    "fr": {
        "rouge": "🔴",
        "jaune": "🟡",
        "bleu": "🔵",
        "marron": "🟤",
        "vert": "🟢",
        "orange": "🟠",
        "violet": "🟣",
        "noir": "⚫"
    },
    "en": {
        "red": "🔴",
        "yellow": "🟡",
        "blue": "🔵",
        "brown": "🟤",
        "green": "🟢",
        "orange": "🟠",
        "purple": "🟣",
        "black": "⚫"
    }
}

const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
const Command = require("../../structures/Command");
const {
    list,
    verify
} = require("../../structures/Utils");

const {
    Connect4AI
} = require('connect4-ai');
const {
    stripIndents
} = require("common-tags");

module.exports = class ConnectFourCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'connect4',
            usage: 'connect4 <@user> <color>',
            description: 'Play Connect Four with a friend. Want to play with me? Just tag me!',
            type: 'fun',
        });
    }

    async run(message, args) {
        let opponent = message.mentions.users.first();
        if (!opponent) return message.reply(message.guild.lang.COMMANDS.CONNECT4.noMention);
        if (!args[1]) return message.reply(message.guild.lang.COMMANDS.CONNECT4.noColor(list(Object.keys(colors[message.guild.lang.code]), message.guild.lang.COMMANDS.CONNECT4.conj)))
        if (!Object.keys(colors[message.guild.lang.code]).includes(args[1].toLowerCase())) return message.reply(message.guild.lang.COMMANDS.CONNECT4.noColor(list(Object.keys(colors[message.guild.lang.code]), message.guild.lang.COMMANDS.CONNECT4.conj)))
        let color = args[1].toLowerCase();
        if (opponent.id === message.author.id) return message.reply(message.guild.lang.COMMANDS.CONNECT4.againstYourself);

        const games = this.bot.games.get(message.channel.id);
        if (games) return message.reply(message.guild.lang.COMMANDS.CONNECT4.currentGame);
        this.bot.games.set(message.channel.id, {
            name: "connect4"
        });
        let playerOneEmoji = colors[message.guild.lang.code][color];
        let playerTwoEmoji = ['yellow', 'jaune'].includes(color) ? colors.en.red : colors.en.yellow;

        try {
            const available = Object.keys(colors[message.guild.lang.code]).filter(clr => {
                if (['bleu', 'blue'].includes(color) && ['violet', 'purple'].includes(clr)) return false;
                if (['violet', 'purple'].includes(color) && ['bleu', 'blue'].includes(clr)) return false;
                return color !== clr;
            });
            if (opponent.bot) {
                playerTwoEmoji = colors[message.guild.lang.code][available[Math.floor(Math.random() * available.length)]];
            } else {
                await message.channel.send(message.guild.lang.COMMANDS.CONNECT4.askingOpponent(opponent, message.author));

                const verification = await verify(message.channel, opponent);
                if (!verification) {
                    this.bot.games.delete(message.channel.id);
                    return message.reply(message.guild.lang.COMMANDS.CONNECT4.denied);
                } else {
                    await message.channel.send(message.guild.lang.COMMANDS.CONNECT4.colors(opponent, list(available, message.guild.lang.COMMANDS.CONNECT4.conj)));
                    const filter = res => res.author.id === opponent.id && available.includes(res.content.toLowerCase());
                    let p2Color = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000
                    });
                    if (p2Color.size) playerTwoEmoji = colors[message.guild.lang.code][p2Color.first().content.toLowerCase()];
                }
            }
            let AIEngine = null;
            if (opponent.bot) AIEngine = new Connect4AI();
            const board = this.generateBoard();
            let userTurn = true;
            let winner = null;
            let colLevels = [5, 5, 5, 5, 5, 5, 5];
            let lastTurnTimeout = false;
            let lastMove = message.guild.lang.COMMANDS.CONNECT4.none;
            while (!winner && board.some(row => row.includes(null))) {
                const user = userTurn ? message.author : opponent;
                const sign = userTurn ? 'user' : 'oppo';
                let i;
                if (opponent.bot && !userTurn) {
                    i = AIEngine.playAI('hard');
                    lastMove = i + 1;
                } else {
                    await message.channel.send(message.guild.lang.COMMANDS.CONNECT4.chooseColumn(user, lastMove, this.displayBoard(board, playerOneEmoji, playerTwoEmoji), nums.join('')));

                    const pickFilter = res => {
                        if (res.author.id !== user.id) return false;
                        const choice = res.content;
                        if (choice.toLowerCase() === 'stop') return true;
                        const j = Number.parseInt(choice, 10) - 1;
                        return board[colLevels[j]] && board[colLevels[j]][j] !== undefined;
                    };

                    const turn = await message.channel.awaitMessages(pickFilter, {
                        max: 1,
                        time: 60000
                    });
                    if (!turn.size) {
                        await message.channel.send(message.guild.lang.COMMANDS.CONNECT4.timesUp);
                        if (lastTurnTimeout) {
                            winner = 'time';
                            break;
                        } else {
                            lastTurnTimeout = true;
                            userTurn = !userTurn;
                            continue;
                        }
                    }
                    const choice = turn.first().content;
                    if (choice.toLowerCase() === 'stop') {
                        winner = userTurn ? opponent : message.author;
                        break;
                    }
                    i = Number.parseInt(choice, 10) - 1;
                    if (AIEngine) AIEngine.play(i);
                    lastMove = i + 1;
                }
                board[colLevels[i]][i] = sign;
                colLevels[i]--;
                if (this.verifyWin(board)) winner = userTurn ? message.author : opponent;
                if (lastTurnTimeout) lastTurnTimeout = false;
                userTurn = !userTurn;
            }
            this.bot.games.delete(message.channel.id);
            if (winner === 'time') return message.channel.send(message.guild.lang.COMMANDS.CONNECT4.inactivity);
            return message.channel.send(stripIndents `
                ${winner ? message.guild.lang.COMMANDS.CONNECT4.winString(winner) : message.guild.lang.COMMANDS.CONNECT4.drawString}
                ${message.guild.lang.COMMANDS.CONNECT4.finalMove} **${lastMove}**

                ${this.displayBoard(board, playerOneEmoji, playerTwoEmoji)}
                ${nums.join('')}
            `);
        } catch (err) {
            this.bot.games.delete(message.channel.id);
            throw err;
        }
    }

    generateBoard() {
        const arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push([null, null, null, null, null, null, null]);
        }
        return arr;
    }

    displayBoard(board, playerOneEmoji, playerTwoEmoji) {
        return board.map(row => row.map(piece => {
            if (piece === 'user') return playerOneEmoji;
            if (piece === 'oppo') return playerTwoEmoji;
            return blankEmoji;
        }).join('')).join('\n');
    }

    verifyWin(board) {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                if (this.checkLine(board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c])) return board[r][c];
            }
        }
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.checkLine(board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3])) return board[r][c];
            }
        }
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.checkLine(board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3])) return board[r][c];
            }
        }
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.checkLine(board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3])) return board[r][c];
            }
        }
        return null;
    }

    checkLine(a, b, c, d) {
        return (a !== null) && (a === b) && (a === c) && (a === d);
    }
}