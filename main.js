// get file locations for various releases
const public_release = require(`./release_public/public_index`);
const onlineCollege_release = require(`./release_oc/oc_index`);

// clear console and log startup events
console.clear();
console.log(`Stating Wall-E...`);

// starting public release
public_release;
console.log(`Launching public release...`);

// starting online college release
onlineCollege_release;
console.log(`Launching Online College release...`);