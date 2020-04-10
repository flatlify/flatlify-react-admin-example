const server = require('flatlify-server');
const path = require('path');

const app = server(`${__dirname}`, path.resolve(__dirname, '..'));
