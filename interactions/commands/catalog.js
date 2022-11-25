const axios = require(`axios`)
const jsdom = require("jsdom");

module.exports = {

    name: `catalog`,

    async execute(client, interaction) {

        // defer interaction reply
        await interaction.deferReply();

        // get & scrub user input. If input matches valid course regex, create classDetails object
        const course = interaction.options._hoistedOptions[0].value;
        const classDetails = inputScrubber(course);
        if (!classDetails) return await errorReply(client, interaction, `INVALID`, course);

        // validate ther couse has a page on the ISU Course Catalog, if it does, retreive the course's html page
        const html = await classValidation(classDetails.url);
        if (!html) return await errorReply(client, interaction, `NONEXISTENT`, classDetails.classCode);

        // load the HTML of the course page as an HTML DOM
        const dom = new jsdom.JSDOM(html.replaceAll(`<br/>`, `\n`)); // clunky replacement of page break with \n- makes my life a lot easier

        // get object of all classData found in the HTML & then pass to generateClassDataObject() to clean up
        const classDataArray = dom.window.document.getElementsByClassName(`searchresult search-courseresult`)[0].textContent.split(`\n`).filter(n => n != ``);
        const classData = generateClassDataObject(classDataArray);

        // create embed content
        let embedContent = ``
        embedContent += `*${classData.credits} ${classData.semestersOffered}*`
        if (classData.prereq) {
            const prereqOutput = getClassLinks(classData.prereq);
            embedContent += `\n\n**Prerequsites:** ` + prereqOutput;
        }
        if (classData.description) embedContent += `\n\n> ` + classData.description;
        if (classData.limitations) {
            const limitationsOutput = getClassLinks(classData.limitations);
            embedContent += `\n\n*${limitationsOutput}*`;
        }

        // create & send embed
        const embed = client.embedCreate({
            title: classData.title,
            url: classDetails.url,
            description: embedContent,
            color: `F1BE48`,
        });
        await interaction.followUp({ embeds: [embed] });
    }
};

/**
 * Attempts to scrub/sanitize user input 
 * @param {String} classInput User Input
 * @returns {Object|undefined}
 */
function inputScrubber(classInput) {

    // Attempt to split department and course number & process department input
    const department = classInput.match(/([A-Za-z\s]+)/)[0];
    const classNumber = classInput.split(department)[1];
    const scrubbedDepartment = department.toUpperCase().replaceAll(/[^A-Z]/g, ``);

    // check to see if the department includes 
    const { deptCodes } = require(`../../utils/resources/deptCodes.js`);
    const validatedInput = deptCodes[scrubbedDepartment];

    // create normalized classcode and test to match expected format
    const classCode = `${validatedInput} ${classNumber}`;
    if (!classCode.match(/([^\s:,.\)a-z0-9])([A-Z\s]+)(\s)([0-9]{3}[A-Z]{0,1})(?![a-zA-Z0-9])/g)) return undefined;

    // if format matches, create & return the classDetails object, else return undefined
    if (validatedInput) {
        const searchTerm = classCode.replaceAll(` `, `+`);
        const url = `https://catalog.iastate.edu/search/?search=${searchTerm}`;
        return {
            classCode: classCode,
            department: validatedInput,
            classNumber: classNumber,
            searchTerm: searchTerm,
            url: url
        };
    } else return undefined;
}

/**
 * 
 * @param {String} url Sanitized URL of requested class
 * @returns {HTML|undefined}
 */
async function classValidation(url) {
    const { data } = await axios.get(url);
    return !data.includes(`Results not found.`) ? data : undefined;
}

/**
 * Function to add links to courses if they exist in a string
 * @param {String} text Text potentially containing course codes
 * @returns {String}
 */
function getClassLinks(text) {

    // look for all courses that may exist within the text- if none, return
    const foundCourses = text.match(/([^\s:,.\)a-z])([A-Z\s]{2,})\s([0-9]{3})([A-Z]{0,1})/g);
    if (!foundCourses) return text;

    // if courses exist, add markdown formatted links & then return
    let output = text;
    foundCourses.forEach(course => {
        const url = `https://catalog.iastate.edu/search/?search=${course.replaceAll(` `, `+`)}`;
        output = output.replace(course, `[${course}](${url})`);
    });
    return output;
}

/**
 * Cleans up the given array and delivers an object payload of course data
 * @param {Array} classDataArray Array of course information
 * @returns {Object}
 */
function generateClassDataObject(classDataArray) {
    // create array with known data locations
    const classData = {
        title: classDataArray[0],
        credits: classDataArray[1],
        semestersOffered: classDataArray[2].trim(),
    }

    // location of description is dependent on if prereqs are a property of the class- adding to the object accordingly
    if (classDataArray.length > 4 && classDataArray[3].includes(`Prereq`)) {
        classData.prereq = classDataArray[3].replace(`Prereq: `, ``);
        classData.description = classDataArray[4];
    } else {
        classData.prereq = null;
        classData.description = classDataArray[3];
    }

    // check to see if the course has any limitations/restrictions
    if (classDataArray.length > 4 && (classDataArray[classDataArray.length - 1].trim() != classData.description)) {
        classData.limitations = classDataArray[classDataArray.length - 1].trim();
    } else classData.limitations = null;

    // and then return the object
    return classData;
}

/**
 * Send an error message if the class input is wrong or cannot be found
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object returned from the 
 * @param {String} errMsg INVALID|NONEXISTENT
 * @param {String} course The user input which caused the issue
 */
async function errorReply(client, interaction, errMsg, course) {
    let msg = ``;
    switch (errMsg) {
        case `INVALID`:
            msg = `Hmm... \`${course}\` doesn't look a valid course.`;
            break;
        case `NONEXISTENT`:
            msg = `I can't seem to find \`${course}\` on the [ISU Course Catalog](https://catalog.iastate.edu/azcourses/).`;
            break;
    }

    msg += ` Please check your spelling and try again! If you think this is a mistake & the course does exist, please let Rohan know.`;

    const embed = client.embedCreate({
        description: msg,
        timestamp: true,
    });

    await interaction.followUp({ embeds: [embed] });
}
