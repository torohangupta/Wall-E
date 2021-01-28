const { MessageEmbed } = require('discord.js');
const { consoleChannel } = require(`../resources/config.json`);
const { checkmark, crossmark } = require(`../resources/emojis.json`)

module.exports = {

    name: `role`,
    aliases: [`role`, `class`, `classrole`, `cr`],
    description: `Use this command to get class roles!`,
    usage: `view/add/remove <class-code>`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // limit usage to online college
        if (message.member.guild.name != `Online College`) {
            return message.channel.send(`I'm sorry, you can't use this command in this server. This command was custom written for the **Online College** Discord Server & will not work properly here.`);
        }

        // id for #updates
        updatesChannel = `801893303444045854`;

        // subcommand aliases
        createAliases = [`create`, `new`];
        deleteAliases = [`delete`, `del`];
        viewAliases = [`view`, `viewall`];


        // command blacklisted roles
        blacklistedRoleIDs = [
            // Admins, Mods & Trusted Members
            `694651259059437710`, // Literally God
            `692097359005351947`, // Supreme Overseers
            `765414388248215574`, // Trusted Members
            `692097738283810896`, // Members
            `790031205407784991`, // Server Boosters
            `692094440881520671`, // @everyone
            // Majors
            `789736589470990367`, // AER E
            `789737168062251029`, // A B E
            `789738250335289374`, // CON E
            `791025436603318302`, // CH E
            `789738504393195541`, // CIV E
            `791045991397851136`, // COM S
            `791045815304323124`, // CPR E
            `791014295634837564`, // CYS E
            `789738716913467393`, // E E
            `789738852315168799`, // E M
            `789739007239520266`, // I E
            `789739213276971028`, // MAT E
            `789739407744827463`, // M E
            `791045679023390720`, // S E
            // Bots
            `692100602297188382`, // Bot Overlords
            `789623704538578985`, // MEE6
            `798626556384772107`, // Math
            `692099919602909254`, // Rythm
            `789733296077537282`, // Zira
            `779433406710415401`, // Wall-E
            `788914781880188928`,  // Wall-E Dev
            // Year
            `804213020610789376`, // Incoming/Prospective
            `804213426515345428`, // Freshman
            `804213586779045898`, // Sophomore
            `804213800098070528`, // Junior
            `804214005102542848`, // Senior
            `804216647975174144`  // Graduated
        ];

        // convert user arguments to lowercase
        cmdArg = args[0].toLowerCase();
        if (args[1]) {
            roleArg = args[1].toLowerCase();
        }

        // command handling
        if (createAliases.includes(cmdArg) && message.member.hasPermission(`MANAGE_CHANNELS`)) {
            // CREATE ROLE
            createRole(roleArg.toLowerCase());

        } else if (deleteAliases.includes(cmdArg) && message.member.hasPermission(`MANAGE_CHANNELS`)) {
            // DELETE ROLE
            deleteRole(roleArg.toLowerCase());

        } else if (viewAliases.includes(cmdArg)) {
            // VIEW ALL ROLES
            viewRoles();

        } else if (cmdArg == `add`) {
            // ADD ROLE
            addRoles(roleArg);

        } else if (cmdArg == `remove`) {
            // REMOVE ROLE
            removeRoles(roleArg);

        } else {
            message.channel.send(`Error: You did not list a valid argument.\nYou can type \`~role\`, \`~classrole\`, \`~cr\` and then **ONE** of the following:\n> \`view\`/\`viewall\` (view all self-assignable roles),\n> \`add\` (add a role)\n> \`remove\` (remove a role).`);
            message.react(crossmark.emote);
        }

        function createRole(roleName) {

            // check to make sure the role doesn't exist already
            if (message.member.guild.roles.cache.find(role => role.name === roleName)) { message.channel.send(`Error: This role exists already!`); return; }

            // try to create the role
            try {
                // Create a new role with the name mentioned
                message.guild.roles.create({
                    data: {
                        name: roleName.toLowerCase(),
                        permissions: [],
                        mentionable: true,
                    }
                }).then(r => {
                    // create support text channel for message.author & send messages & create reaction collector. Set support ticket status to waiting for user input/issue.
                    message.guild.channels.create(roleName.toLowerCase(), {
                        type: `text`,
                        parent: message.guild.channels.cache.find(c => c.name == `Unsorted Courses` && c.type == 'category'),
                        permissionOverwrites: [
                            {
                                id: message.channel.guild.roles.everyone,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: `692097359005351947`, // Supreme Overseers
                                allow: ['VIEW_CHANNEL'],
                            },
                            {
                                id: `692100602297188382`, // Bot Overlords
                                allow: ['VIEW_CHANNEL'],
                            },
                            {
                                id: r.id, // role that was just created
                                allow: [`VIEW_CHANNEL`],
                            }
                        ],
                    })
                })
                message.channel.send(`The role \`${roleName.toLowerCase()}\` has been created.`)
                message.react(checkmark.emote);
                message.client.channels.cache.get(consoleChannel).send(`The role \`${roleName.toLowerCase()}\` has been created in **Online College**.`);
                message.client.channels.cache.get(updatesChannel).send(`📥  **New channel added!** - \`${roleName.toLowerCase()}\``);

            } catch (error) {
                message.channel.send(`There was an error. Please create a support ticket by typing \`~support\`.`);
                message.react(crossmark.emote);
                message.client.channels.cache.get(consoleChannel).send(`\`\`\`${error}\`\`\``);
                console.error();
            }

        }

        function deleteRole(roleName) {

            // check to make sure the role exists & is not blacklisted to be deleted or given or the role
            if (!message.member.guild.roles.cache.find(role => role.name === roleName)) { message.channel.send(`Error: The role you're trying to delete (${roleName}), doesn't exist or has already been deleted!`); return; }
            if (blacklistedRoleIDs.includes(message.member.guild.roles.cache.find(role => role.name === roleName).id)) { message.channel.send(`Error: You cannot delete this role.`); return; }

            // try to delete the role
            try {
                message.member.guild.roles.cache.find(role => role.name === roleName).delete();
                message.channel.send(`The role \`${roleName.toLowerCase()}\` has been deleted.`);
                message.react(crossmark.emote);
                message.client.channels.cache.get(consoleChannel).send(`The role \`${roleName.toLowerCase()}\` has been deleted in **Online College**.`);
            } catch (error) {
                message.channel.send(`There was an error. Please create a support ticket by typing \`~support\`.`);
                message.client.channels.cache.get(consoleChannel).send(`\`\`\`${error}\`\`\``);
                console.error();
            }

        }

        function viewRoles() {

            // sort & map all server roles
            allServerRoles = message.member.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r)

            // create a blank variable for selfassignable roles & remove blacklisted roles from assignable roles
            var assignableRoles = [];
            allServerRoles.forEach(role => {
                if (!uppercaseChecker(role.name) && role.id != message.channel.guild.roles.everyone) {
                    assignableRoles.push(message.member.guild.roles.cache.get(role.id));
                }
            });

            const { aere, abe, cone, ce, ee, em, ie, mate, me, se, cpre, coms, other } = roleOrganizer(assignableRoles);

            // create embed with list of assignable roles
            const assignableRolesEmbed = new MessageEmbed()
                .setTitle(`Self-Assignable Roles`)
                .setColor(`c8102e`)
                .setDescription(`Here's a list of all self-assignable roles on the server. To get/remove any of them, type:\n\`\`\`~role add/remove <class-code>\`\`\``)
                .addFields(
                    { name: `\u200B`, value: `🚀 - Aerospace Engineering\n${aere.join(`, `)}` },
                    { name: `\u200B`, value: `🚜 - Agricultural & Bio-Systems Engineering\n${abe.join(`, `)}` },
                    { name: `\u200B`, value: `🔬 - Chemical Engineering\n${che.join(`, `)}` },
                    { name: `\u200B`, value: `🌉 - Civil Engineering\n${ce.join(`, `)}` },
                    { name: `\u200B`, value: `💾 - Computer Engineering\n${cpre.join(`, `)}` },
                    { name: `\u200B`, value: `⌨️ - Computer Science\n${coms.join(`, `)}` },
                    { name: `\u200B`, value: `🚧 - Construction Engineering\n${cone.join(`, `)}` },
                    { name: `\u200B`, value: `💡 - Electrical Engineering\n${ee.join(`, `)}` },
                    { name: `\u200B`, value: `🔩 - Engineering Mechanics\n${em.join(`, `)}` },
                    { name: `\u200B`, value: `🏭 - Industrial Engineering\n${ie.join(`, `)}` },
                    { name: `\u200B`, value: `🧱 - Materials Science & Engineering\n${mate.join(`, `)}` },
                    { name: `\u200B`, value: `⚙️ - Mechanical Engineering\n${me.join(`, `)}` },
                    { name: `\u200B`, value: `💻 - Software Engineering\n${se.join(`, `)}` },
                    { name: `\u200B`, value: `🧠 - Miscellaneous Courses\n${other.join(`, `)}` }
                )
                .setFooter(`Don't see your class here? Create a support ticket by typing ~support`)

            // send message with all assignable roles
            message.channel.send(assignableRolesEmbed)

        }

        function addRoles(roleName) {

            // check to make sure the role exists
            if (message.member.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase())) {

                // if the role exists, find & store it in role
                role = message.member.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

                if (blacklistedRoleIDs.includes(role.id)) {
                    // let user know the role is blacklisted and must be manually assigned
                    message.channel.send(`You cannot add that role. If you think that is a mistake, please create a support ticket by typing \`~support\`.`);
                    message.react(crossmark.emote);
                    return;

                } else {
                    // give role & dm confirmation
                    message.guild.members.cache.get(message.author.id).roles.add(role);
                    message.author.send(`You have added the role \`${role.name}\` in **Online College**.`);
                    message.react(checkmark.emote);
                }

            } else {
                message.channel.send(`That role doesn't exist yet or you included a space in the classcode. If you did, remove the space and try again. If you would like a channel with the role, please type \`~support\` to create a support ticket & request for the role.`);
                message.react(crossmark.emote);
            }
        }

        function removeRoles(roleName) {

            // check to make sure the role exists
            if (message.member.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase())) {

                // if the role exists, find & store it in role
                role = message.member.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

                // make sure user has the role they are trying to remove
                if (!message.member._roles.includes(role.id)) {
                    message.channel.send(`You do not have that role. You can add roles using \`~role add <class>\`. If you need additional help, please create a support ticket by typing \`~support\`.`);
                    message.react(crossmark.emote);
                    return;
                }

                if (blacklistedRoleIDs.includes(role.id)) {
                    // let user know the role is blacklisted and must be manually removed
                    message.channel.send(`You cannot remove that role. If you think that is a mistake, please create a support ticket by typing \`~support\`.`);
                    message.react(crossmark.emote);
                    return;

                } else {
                    // remove role & dm confirmation
                    message.guild.members.cache.get(message.author.id).roles.remove(role);
                    message.author.send(`You have removed the role \`${role.name}\` in **Online College**.`);
                    message.react(checkmark.emote);
                }

            } else {
                message.channel.send(`That role doesn't exist yet. If you would like a channel with the role, please type \`~support\` to create a support ticket & request for the role.`);
                message.react(crossmark.emote);
            }
        }

        function roleOrganizer(roles) {

            // initialize major catogeries
            aere = [];
            abe = [];
            cone = [];
            che = [];
            ce = [];
            ee = [];
            em = [];
            me = [];
            ie = [];
            mate = [];
            meche = [];
            coms = [];
            se = [];
            cpre = [];
            other = [];

            // sort roles by major
            roles.forEach(role => {
                if (role.name.includes(`aere`)) {
                    aere.push(role)
                } else if (role.name.includes(`abe`)) {
                    abe.push(role)
                } else if (role.name.includes(`cone`)) {
                    cone.push(role)
                } else if (role.name.includes(`che`)) {
                    che.push(role)
                } else if (role.name.includes(`ce`)) {
                    ce.push(role)
                } else if (role.name.includes(`ee`)) {
                    ee.push(role)
                } else if (role.name.includes(`em`)) {
                    em.push(role)
                } else if (role.name.includes(`ie`)) {
                    ie.push(role)
                } else if (role.name.includes(`mate`)) {
                    mate.push(role)
                } else if (role.name.includes(`me`)) {
                    me.push(role)
                } else if (role.name.includes(`se`)) {
                    se.push(role)
                } else if (role.name.includes(`cpre`)) {
                    cpre.push(role)
                } else if (role.name.includes(`coms`)) {
                    coms.push(role)
                } else {
                    other.push(role)
                }
            });

            // return class role arrays
            return { aere, abe, cone, ce, ee, em, ie, mate, me, se, cpre, coms, other }
        }

        function uppercaseChecker(str) {
            return (/[A-Z]/.test(str));
        }
    },
};