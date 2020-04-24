const express = require('express');
const server = express();
const postRoutes = require('../posts/postRoutes.js');

server.use(express.json());

//Routers
server.use('/api/posts', postRoutes);

module.exports = server;