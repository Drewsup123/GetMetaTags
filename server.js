const express = require("express");
const cors = require("cors");
const server = express();
const urlMetadata = require('url-metadata')

server.post('/',(req,res) => {
    const data = req.body;
    res.status(200).send("hello")
})

server.get('/',(req,res) => {
    const data = req.body;
    res.status(200).send("hello")
})

// urlMetadata('http://bit.ly/2ePIrDy').then(
//   function (metadata) { // success handler
//     console.log(metadata)
//   },
//   function (error) { // failure handler
//     console.log(error)
//   })
module.exports = server;