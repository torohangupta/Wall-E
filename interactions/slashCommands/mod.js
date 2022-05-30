const { MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`);
const { roleID } = require(`../../dependencies/resources/config.json`);

module.exports = {

    name: `mod`,

    execute(interaction) {

        // mod & admin roles

        var message = ``;

        // other important stuff
        const userRoleIDs = interaction.member._roles;

        // restrict usage to mods
        if (!userRoleIDs.includes(modroleId)) {
            return interaction.reply({ content: `I'm sorry, only moderators can use this command!`, ephemeral: true });
        }


        const subCommand = interaction.options._subcommand;

        switch (subCommand) {
            case `offer`:
                if (userRoleIDs.includes(roleID.admin)) {
                    // if admin, try to find channel to offer role to
                    let guildMember = interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].value)
                    let usernameScrubbed = guildMember.user.username.toLowerCase().replace(/[^a-z]+/g, '');

                    const modappChannel = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`modapp-${usernameScrubbed}`)).map(c => c);

                    if (modappChannel.length == 0) {
                        return interaction.reply({ content: `That person does not have a mod application open! Please try again`, ephemeral: true });

                    } else {
                        // offer mod position
                        const modOfferEmbed = new MessageEmbed()
                            .setTitle(`Mod Offer`)
                            .setDescription(`Congratulations! You'be been offered the position! When you're ready to accept, click \`🔨 Accept the Role\`!`)
                            .setColor(`4b6999`)

                        const modRoleButton = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('modappAccept')
                                    .setLabel(`Accept the Role`)
                                    .setStyle('DANGER')
                                    .setEmoji(`🔨`)
                            )

                        modappChannel[0].send({ embeds: [modOfferEmbed], components: [modRoleButton] });
    
                        message = `Sent offer to ${guildMember} in \`#modapp-${usernameScrubbed}\``;
                    }
                    
                } else {
                    return interaction.reply({ content: `Only admins can use this command.`, ephemeral: true });
                }
        }

        // create reply embed
        const replyEmbed = new MessageEmbed()
            .setDescription(message)
            .setColor(`45ad80`)

        // reply to the interaction
        return interaction.reply({ embeds: [replyEmbed], allowedMentions: { repliedUser: false} });
    }
};