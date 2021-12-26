const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {

    name: `xkcd`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    async execute(interaction) {

        const totalNumComics = 2499;
        let comicNumber = Math.floor(Math.random() * totalNumComics) + 1;

        try {
            const url = `https://xkcd.com/${comicNumber}/info.0.json`;
            const response = await axios.get(url);

            const comic = new MessageEmbed()
                .setTitle(response.data.title)
                .setDescription(`xkcd #${comicNumber} | ${response.data.month}/${response.data.year}`)
                .setURL(url)
                .setColor(`96a8c8`)
                .setImage(response.data.img)

            // reply to the interaction
            interaction.reply({ embeds: [comic], allowedMentions: { repliedUser: false }})

        } catch (err) {
            interaction.reply(`something broke man`);
        }
    },
};