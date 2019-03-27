const express = require("express");
const cors = require("cors");
const server = express();
const urlMetadata = require('url-metadata')

server.post('/',(req,res) => {
    const data = req.body;
    res.status(200).send("hello")
})

server.post('/get-meta',(req,res) => {
    const data = req.body;
    urlMetadata('https://medium.freecodecamp.org/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3')
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})

// urlMetadata('http://bit.ly/2ePIrDy').then(
//   function (metadata) { // success handler
//     console.log(metadata)
//   },
//   function (error) { // failure handler
//     console.log(error)
//   })
module.exports = server;