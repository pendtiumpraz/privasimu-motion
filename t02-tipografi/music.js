const { CONFIG, SCENES } = require('./scenes');
module.exports = require('../lib/music-kit')(CONFIG.music, SCENES);
