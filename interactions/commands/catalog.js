const axios = require(`axios`)
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {

    name: `catalog`,

    async execute(client, interaction) {

        let url = `https://catalog.iastate.edu/search/?search=AER+E+160`
        // const course = interaction.options._hoistedOptions[0].value;

        const { data } = await axios.get(url);
        // const { doucment} = new JSDOM(data, {
        //     runScripts: "dangerously",
        //     resources: "usable",
        // }).window;
        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable",
        });
        const { document } = dom.window;
        const input1 = data.getElementsByClassName(`credits noindent`);
        // const test = dom.getElementByClassName(`credits noindent`)

        console.log(input1)

        // interaction.reply(course)

        // post embed for poll and react with check or cross
        interaction.deferReply();
    }
};