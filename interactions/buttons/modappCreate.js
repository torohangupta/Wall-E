const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `modappCreate`,

    execute(interaction) {

        // determine if the user has an application open already or not
        const buttonUser = interaction.member.user;
        const usernameScrubbed = buttonUser.username.toLowerCase().replace(/[^a-z]+/g, '');
        const textChannels = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`modapp`)).map(c => c.name);

        if (textChannels.includes(`modapp-${usernameScrubbed}`)) {
            return interaction.reply({ content: `You already have an application open! Please complete your existing application!`, ephemeral: true });
        } else {
            // reply to the interaction
            interaction.deferUpdate();
        }

        // create embed with instructions and buttons
        const modappEmbed_main = new MessageEmbed()
            .setTitle(`Join the moderation team!`)
            .setDescription(`To confirm opening a new ticket, please press the "📝 Continue" button and a moderator will be able to help you shortly. If this was a mistake, simply close the ticket by clicking the "🔒 Close" button.`)
            .setDescription(`Thank you for your interest in joining the moderation team! Please answer the questions below, review the <#798764172929662996> and then click the \`✔️ Submit\` to submit your application. If this was a mistake, simply cancel your application by clicking the \`🔒 Cancel\` button.\n\n**General Questions**\n> 1. What is your name? (Optional)\n> 2. What year are you?\n> 3. What is your major?\n\n**Application Questions:**\n> 1. Why do you want to be a part of the moderation team?\n> 2. How familar are you with Discord & using Discord bots?\n> 3. How familiar are you with Iowa State, campus, etc.?\n> 4. Do you have any experience that may be relevent to the role?\n\n*Thank you for your interest in joining the moderation team! We'll look at your application as soon as possible. In the meantime, feel free to share your favorite meme!*`)
            .setColor(`4b6999`)

        const modappEmbedButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('modappCancel')
                    .setLabel(`Cancel Application`)
                    .setStyle('DANGER')
                    .setEmoji(`🔒`)
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('modappSubmit')
                    .setLabel(`Submit Application`)
                    .setStyle('SUCCESS')
                    .setEmoji(`✔️`)
            )

        // perform interaction actions
        interaction.member.guild.channels.create(`modapp-${usernameScrubbed}`, {
            type: 'GUILD_TEXT',
            parent: interaction.channel.parentId,
            permissionOverwrites: [
                {
                    id: interaction.channel.guild.roles.everyone,
                    deny: [`VIEW_CHANNEL`],
                },
                {
                    id: `692097359005351947`, // Supreme Overseers
                    deny: [`VIEW_CHANNEL`],
                },
                {
                    id: interaction.user.id,
                    allow: [`SEND_MESSAGES`, `VIEW_CHANNEL`],
                },
            ],
        }).then(supportChannel => {
            supportChannel.send(`<@${buttonUser.id}>`).then(m => m.delete());
            supportChannel.send({ embeds: [modappEmbed_main], components: [modappEmbedButtons] });
        })

    },
};