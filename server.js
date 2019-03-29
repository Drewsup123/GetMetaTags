const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const request = require("request")
const cheerio = require('cheerio');
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
  let links = [];
  request(
    {
      method: 'GET',
      url: 'http://api.scraperapi.com/?key=9bd569c5901a72fa4a94d2b525a9b007&url=' + url + '&render=true',
      headers: {
        Accept: 'application/json',
      },
    },
    function(error, response, body) {
      const $ = cheerio.load(body);
      $('.merchandising-course-card--mask--2-b-d').each(function(i, elm) {
        links.push($(elm).attr('href'));
    });
    let newArray = [];
    for(let i = 0; i < links.length; i++){
      newArray.push(`https://www.udemy.com${links[i]}`)
    }
    res.status(200).send(newArray)
    }
  );
});

// ```const divList = [...document.querySelectorAll(".profile-course-card--card--sx0Aa")]
// for (let i = 0; i<divList.length; i++) {
//     let courseId = i + 1
//     let photoUrl = divList[i].lastChild.attributes[0].ownerElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].currentSrc
//     let title = divList[i].lastChild.attributes[0].ownerElement.firstChild.children[0].children[0].nextElementSibling.children[0].childNodes[0].innerText
//     let author = divList[i].lastChild.children[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerText
//     let rating = divList[i].lastChild.attributes[0].ownerElement.firstChild.children[0].children[0].nextElementSibling.childNodes[1].firstChild.innerText
//     let courseUrl = divList[i].childNodes[1].childNodes[0].childNodes[0].href
//     console.log("\n\ncourseId:  ",courseId,"\ntitle:  ",title,"\nauthor:  ",author,"\nudemyRating:  ",rating,"\nphotoUrl:  ",photoUrl,"\ncourseUrl:  ",courseUrl)

// }```
module.exports = server;


