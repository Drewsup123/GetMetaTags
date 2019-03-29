const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const cheerio = require("cheerio");
const axios = require("axios");

server.use(express.json());
server.use(cors());


server.get("/", (req, res) => {
  res.status(200).send("hello");
});

server.post("/get-meta", (req, res) => {
  const url = req.body.url;
  if (url) {
    if (url.includes("http://") || url.includes("https://")) {
      urlMetadata(url)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send(err);
        });
    } else {
      res
        .status(400)
        .send("bad request. Make sure to have http or https in req.body");
    }
  } else {
    res.status(500).send("Url not provided");
  }
});

server.post("/user-udemy", (req, res) => {

  console.log(req.body.url);

  axios.get(req.body.url).then((response) => {
      console.log(response.data)
    return response.data
  }).catch((err)=> {
    console.log(err)
  })


  
  // const url = req.body.url;
  // if(url){
  //     const data = cheerio.load(url)

  //     res.status(200).send(data)

  // }
});

module.exports = server;
