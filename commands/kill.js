module.exports = {

    name: `death`,
    aliases: [`death`, `suicide`],
    description: `Roll a d20 to be sucided`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

	execute(message, args) {
		function getRndInteger() {
            return Math.floor(Math.random()*20+1);
        }

        killRole = getRndInteger();
        message.channel.send(`You rolled a ${killRole}`);

        if (killRole == 20) {
            message.channel.send(`Congrats, by rolling a ${killRole}, you succeed in killing yourself`);

        } else {
            message.channel.send(`Wow, you fucking rolled a ${killRole}. You can't even kill yourself. Loser.`);

        }
	},
};