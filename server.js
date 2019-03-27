const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require('url-metadata')

server.use(express.json());
server.use(cors());

server.get('/',(req,res) => {
    res.status(200).send("hello")
})

server.post('/get-meta', (req, res) => {
    const url = req.body.url;
    if(url){
        if(url.includes("http://") || url.includes("https://")){
            urlMetadata(url)
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err=>{
                res.status(500).send(err)
            })
        }else{
            res.status(400).send("bad request. Make sure to have http or https in req.body")
        }

    }else{
        res.status(500).send("Url not provided");
    }
})

module.exports = server;