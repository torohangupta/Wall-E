// get file locations for various releases
const public_release = require(`./release_public/public_index`);
const onlineCollege_release = require(`./release_oc/oc_index`);

// clear console and log startup events
console.clear();
console.log(`Stating Wall-E...`);

// startup releases
public_release.then(console.log(`Launching public release...`));
onlineCollege_release.then(console.log(`Launching Online College release...`));