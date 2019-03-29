const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const request = require("request")
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

server.get("/user-udemy", (req, res) => {
  // api key :  9bd569c5901a72fa4a94d2b525a9b007
  var url = 'https://www.udemy.com/user/hunter-smith-23/';
  request(
    {
      method: 'GET',
      url: 'http://api.scraperapi.com/?key=9bd569c5901a72fa4a94d2b525a9b007&url=' + url + '&render=true',
      headers: {
        Accept: 'application/json',
      },
    },
    function(error, response, body) {
      res.status(200).send(body)
    }
  );
});

module.exports = server;
