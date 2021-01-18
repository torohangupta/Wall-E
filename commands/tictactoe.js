const { MessageEmbed } = require(`discord.js`);

module.exports = {

    name: `Tic-Tac-Toe`,
    aliases: [`Tic-Tac-Toe`, `tic-tac-toe`, `tictactoe`, `ttt`],
    description: `Play Tic-Tac-Toe with a friend!`,
    usage: `<@user>`,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: true,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // define rows
        var gameboard = [
            [`🔲`, `🔲`, `🔲`],
            [`🔲`, `🔲`, `🔲`],
            [`🔲`, `🔲`, `🔲`]
        ]

        // create variables for players 1 & 2
        const p1 = message.author;
        const p2 = message.mentions.users.map(u => u)[0];

        var turn = 1;
        var movesPlayed = 0;

        if (p1.id == p2.id) {
            return message.channel.send(`You can't play against yourself!`);
        } else if (p2.bot) {
            return message.channel.send(`You can't play against a bot!`);
        }

        message.channel.send(gameUI(gameboard, p2, p1, `⭕`, `❌`, ``, `game-strt`)).then(gameMsg => {

            // create message collector for the channnel
            const moveCollector = gameMsg.channel.createMessageCollector(m => m.author.id == p1.id || m.author.id == p2.id, { time: 600000 });
            moveCollector.on(`collect`, moveMessage => {

                // check for turn
                if (moveMessage.author.id == p1.id && turn != 1) {
                    return gameMsg.channel.send(`It is not your turn.`);
                } else if (moveMessage.author.id == p2.id && turn != 2) {
                    return gameMsg.channel.send(`It is not your turn.`);
                }

                // make move readable by js
                move = moveMessage.content.trim().split(``)

                // check for correct move syntax & validity
                if ((/[rR]/).test(move[0]) && (/[1-3]/).test(move[1]) && (/[cC]/).test(move[2]) && (/[1-3]/).test(move[3]) && move.length == 4) {

                    // shift user index to js index
                    move[1] = move[1] - 1;
                    move[3] = move[3] - 1;

                    // determine who's turn it is
                    if (turn == 1) {
                        // player 1's turn (❌)
                        if (turnValidator(gameboard, move) == `valid`) {

                            // if the move is valid, make the move
                            gameboard[move[1]][move[3]] = `❌`;

                            if (winChecker(`❌`, move, gameboard) == `game over`) {
                                moveCollector.stop()
                                gameMsg.edit(gameUI(gameboard, p2, p1, `⭕`, `❌`, move, `game-over`))

                            } else {
                                gameMsg.edit(gameUI(gameboard, p2, p1, `⭕`, `❌`, move, `game-inprogress`))
                            }

                            // set turn to p2
                            turn = 2;
                            movesPlayed++;

                            // stalemante
                            if (movesPlayed == 9) {
                                moveCollector.stop();
                                gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `game-stalemate`));
                                return;
                            }

                        } else {
                            return gameMsg.edit(gameUI(gameboard, p2, p1, `⭕`, `❌`, move, `err-location`));
                        }

                    } else {
                        // player 2's turn (⭕)
                        if (turnValidator(gameboard, move) == `valid`) {

                            // if the move is valid, make the move
                            gameboard[move[1]][move[3]] = `⭕`;

                            if (winChecker(`⭕`, move, gameboard) == `game over`) {
                                moveCollector.stop();
                                gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `game-over`));

                            } else {
                                gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `game-inprogress`));
                            }

                            // set turn to p1
                            turn = 1;
                            movesPlayed++;

                            // stalemante
                            if (movesPlayed == 9) {
                                moveCollector.stop();
                                gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `game-stalemate`));
                                return;
                            }

                        } else {
                            return gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `err-location`));
                        }
                    }

                    return moveMessage.delete();

                } else {
                    moveMessage.delete();
                    return gameMsg.edit(gameUI(gameboard, p1, p2, `❌`, `⭕`, move, `err-format`));
                }
            })
        });

        function gameUI(board, activePlayer, standbyPlayer, activeToken, standbyToken, lastMove, stage) {
            /*
                board - current game board
                lastmove - last move made by player (if exists)
                stage - current stage of the game:
                    `game-strt`
                    `game-inprogress`
                    `game-stalemate`
                    `game-over`
                    `err-format`
                    `err-location`
                    `err-timeout`
            */

            // convert move back from js index into user index
            lastMove[1] = lastMove[1] + 1;
            lastMove[3] = lastMove[3] + 1;

            // create base embed
            const ui = new MessageEmbed()
                .setAuthor(`Tic-Tac-Toe`, `https://cdn3.iconfinder.com/data/icons/essenstial-ultimate-ui/64/tic_tac_toe-512.png`)
                .setDescription(`Send your move in the following format: \`r#c#\`.`)
                .setColor(`EA1C24`)
                .addFields(
                    { name: `\u200B`, value: `${board[0].join(` `)}\n${board[1].join(` `)}\n${board[2].join(` `)}`, inline: true }
                )
                .setTimestamp(Date.now())
                .setFooter(`Players: ${p1.username} & ${p2.username}`)

            // logic to correctly add embed fields based on stage of game
            switch (stage) {
                case `game-strt`:
                    ui.addFields(
                        { name: `\u200B`, value: `It is ${message.author}'s turn`, inline: true }
                    )
                    break;
                case `game-inprogress`:
                    ui.addFields(
                        { name: `\u200B`, value: `It is ${activePlayer}'s turn (${activeToken})\n\nLast move: \`${lastMove.join(``)}\` (${standbyToken})`, inline: true }
                    )
                    break;
                case `game-stalemate`:
                    ui.addFields(
                        { name: `\u200B`, value: `Game over! Stalemate!`, inline: true }
                    )
                    break;
                case `game-over`:
                    ui.addFields(
                        { name: `\u200B`, value: `Game over! ${standbyPlayer} won!`, inline: true }
                    )
                    break;
                case `err-format`:
                    ui.addFields(
                        { name: `\u200B`, value: `It is ${activePlayer}'s turn (${activeToken})\n\nInvalid format. Try again.`, inline: true }
                    )
                    break;
                case `err-location`:
                    ui.addFields(
                        { name: `\u200B`, value: `It is ${activePlayer}'s turn (${activeToken})\n\nInvalid location. Try again.`, inline: true }
                    )
                    break;
                case `err-timeout`:
                    ui.addFields(
                        { name: `\u200B`, value: `\`\`\`diff\n- The game lasted too long and has ended.\n\`\`\``, inline: true }
                    )
                    break;
                default:
                    message.channel.send(`I have no clue how you made it here. Please tag Rohan.`)
            }

            // return embed ui
            return ui;
        }

        function turnValidator(board, move) {
            if (board[move[1]][move[3]] != `🔲`) {
                return `invalid`;
            }
            return `valid`;
        }

        function winChecker(token, move, board) {
            // win checker array in following order: row, column, ascending diag, decending diag
            var wc = [0, 0, 0, 0];

            // checking win conditions for the row & column the move was performed & both diagonals
            for (let i = 0; i <= 2; i++) {
                if (board[move[1]][i] == token) {
                    // check win in row
                    wc[0]++;
                }
                if (board[i][move[3]] == token) {
                    // check win in column
                    wc[1]++;
                }
                if (board[2 - i][i] == token) {
                    // check win in ascending diagonal
                    wc[2]++;
                }
                if (board[i][i] == token) {
                    // check win in decending diagonal
                    wc[3]++;
                }
            }

            // if a 3 is detected, return `game over`
            if (wc.includes(3)) {
                return `game over`;
            } else {
                return;
            }
        }
    },
};