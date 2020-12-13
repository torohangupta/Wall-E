const { MessageEmbed } = require("discord.js");
const { pickuplines } = require(`../../Development Release/messages.json`);
const { consoleChannel } = require(`../../Development Release/config.json`);

module.exports = {

    name: `pickup`,
    aliases: [`pickup`, `pickupline`],
    description: `Shares a random, out of context quote`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: true,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // get all tagged users & save first tagged user in user
        taggedusers = message.mentions.users.map(u => u);
        taggedUser = taggedusers[0];

        // get nickname, if user doesn't have a set nickname, return username
        if (!message.member.nickname) {
            uName = message.author.username;

        } else {
            uName = message.member.nickname;
        }

        // get a random pickupline index from list of available pickuplines
        const lineSelection = Math.floor(Math.random() * pickuplines.length);

        // create embed with quote
        const pickupEmbed = new MessageEmbed()
            .setAuthor(`Pickup Lines`, `https://us.123rf.com/450wm/anastasiastoma/anastasiastoma1711/anastasiastoma171100101/89107934-stock-vector-illustration-of-woman-biting-her-lips-.jpg?ver=6`)
            .setColor(`ed010f`)
            .setDescription(pickuplines[lineSelection])
            .setTimestamp(Date.now())
            .setFooter(`${uName}'s shooting their shot!`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        taggedUser.send(pickupEmbed)
        message.client.channels.cache.get(consoleChannel).send(`PickupLines log: Line choice: ${lineSelection}, '${pickuplines[lineSelection]}'. ${uName}'s the one who shot their shot.`);
    },
};