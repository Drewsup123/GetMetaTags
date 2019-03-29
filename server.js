const express = require("express");
const server = express();
const cors = require("cors");
const urlMetadata = require("url-metadata");
const request = require("request")
const cheerio = require('cheerio');
const requestPromise = require("request-promise");
server.use(express.json());
server.use(cors());


server.get("/", (req, res) => {
  res.status(200).send("hello");
});

const F_getMeta = url => {
    
}

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

server.get("/user-udemy", async (req, res) => {
  // api key :  9bd569c5901a72fa4a94d2b525a9b007
  var url = 'https://www.udemy.com/user/hunter-smith-23/';
  let links = []; // original array of "/coursename" links
  let LinksArr = []; //full udemy link with https://www.udemy.com/ parsed in
  let Final = [];

  await requestPromise(
      {
        method: 'GET',
        url: 'http://api.scraperapi.com/?key=9bd569c5901a72fa4a94d2b525a9b007&url=' + url + '&render=true',
        headers: {
          Accept: 'application/json',
        },
      },
      function(error, response, body) {
          const $ = cheerio.load(body); // loads the html body, which should be a string of html content
          $('.merchandising-course-card--mask--2-b-d').each(function(i, elm) { //go to each class of the <a> of courses. In this case it is '.merchandising....' class
            links.push($(elm).attr('href')); // push only the href of each element to links array
          });
          for(let i = 0; i < links.length; i++){
            LinksArr.push(`https://www.udemy.com${links[i]}`) // pushes full link to Final array so we can reference it later
          }
      }
  ); //end request()
  await (async ()=> {
    for(let i = 0; i < LinksArr.length; i++){
      console.log(LinksArr[i]);
      await urlMetadata(LinksArr[i])
        .then(data => {
          Final.push({...data})
          console.log(Final)
        })
        .catch(err => {
          return -1
        });
      // console.log("METADATA", metaData)
      // Final.push({...metaData, url : LinksArr[i]})
      // console.log("final at ",i,Final)
    }
  })();
    res.status(200).send(Final);
  
  

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


