//get whatever file our development mode the app is currently in
module.exports = require('./' + (process.env.NODE_ENV || 'development') + '.json');
